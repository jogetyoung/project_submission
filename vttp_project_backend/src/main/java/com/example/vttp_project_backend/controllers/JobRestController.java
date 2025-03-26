package com.example.vttp_project_backend.controllers;

import com.example.vttp_project_backend.exceptions.UpdatingException;
import com.example.vttp_project_backend.models.*;
import com.example.vttp_project_backend.service.EmailService;
import com.example.vttp_project_backend.service.JobService;
import io.micrometer.core.annotation.Timed;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.io.StringReader;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/repo")
public class JobRestController {

    @Autowired
    JobService jobService;

    @Autowired 
    private EmailService emailService;

    @GetMapping("/applications/{userid}")
    public ResponseEntity<List<AppliedJob>> getAppliedJobs(@PathVariable("userid") String userId) {
        List<AppliedJob> appliedJobs = jobService.getAppliedJobs(userId);

        return ResponseEntity.ok(appliedJobs);
    }


    @Timed(value = "submitting.time", description = "Time taken to insert new application")
    @PostMapping(path = "/{userid}/application", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> insertNewApplication(
            @PathVariable("userid") String userid,
            @RequestPart("jobid") String jobid,
            @RequestPart(name = "resume", required = false) MultipartFile resume) {

        Boolean isUpdated = false;
        // Retrieve applicant and job details (adjust these methods as needed)
        Applicant app = emailService.getUserById(userid);
        JobStat js = emailService.getJob(jobid);

        // Send the notification email using our new method:
        emailService.sendApplicationNotification(app.getEmail(), js.getTitle(), js.getCompany_name());

        try {
            isUpdated = jobService.insertNewApplication(resume.getInputStream(), resume.getContentType(),
                    resume.getSize(), userid, jobid);
            return ResponseEntity.ok("{\"isUpdated\": " + isUpdated + "}");
        } catch (UpdatingException ex) {
            // Handle the case where the user has already applied for the job
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("{\"message\": \"" + ex.getMessage() + "\"}");
        } catch (IOException ex) {
            // Handle any IO exception that may occur
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"An error occurred while processing your application.\"}");
        }
    }

    @PostMapping(path = "/save", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> saveJob(@RequestBody String received) throws UpdatingException {

        JsonReader reader = Json.createReader(new StringReader(received));
        JsonObject receivedObj = reader.readObject();
        String userid = receivedObj.getString("userid");
        String jobid = receivedObj.getJsonNumber("jobid").toString();

        Boolean isAdded = false;
        isAdded = jobService.insertNewBookmark(userid, jobid);

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/saved/{userid}")
    public ResponseEntity<List<Job>> getSavedJob(@PathVariable("userid") String userId) {
        List<Job> appliedJobs = jobService.getSavedJobs(userId);
        return ResponseEntity.ok(appliedJobs);
    }


    @DeleteMapping(path = "/remove/{userid}/{jobid}")
    public ResponseEntity<String> removeSavedJob(@PathVariable("userid") String userid, @PathVariable("jobid") String jobid) throws UpdatingException {

        Boolean isRemoved = false;
        isRemoved = jobService.removeSavedJob(userid, jobid);
        JsonObject resp = Json.createObjectBuilder()
                .add("isRemoved", isRemoved)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }


    @GetMapping("/all-skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> appliedJobs = jobService.getSkills();
        return ResponseEntity.ok(appliedJobs);
    }

    @GetMapping("/updatelastseen/{jobid}")
    public ResponseEntity<String> updateLastSeen(@PathVariable("jobid") String jobid) {

        Boolean isUpdated = false;

        if (jobService.updateLastSeen(jobid)){
            JsonObject resp = Json.createObjectBuilder()
                .add("isUpdated", true)
                .add("status", 200)
                .build();

                return ResponseEntity.ok(resp.toString());
        };

        return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .build()
                    .toString());
    }





    

}
