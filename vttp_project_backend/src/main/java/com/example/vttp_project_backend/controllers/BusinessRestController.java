package com.example.vttp_project_backend.controllers;

import com.example.vttp_project_backend.exceptions.UpdatingException;
import com.example.vttp_project_backend.models.Applicant;
import com.example.vttp_project_backend.models.EachApplicantSearch;
import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.models.JobStat;
import com.example.vttp_project_backend.service.ApiService;
import com.example.vttp_project_backend.service.BizUserService;
import com.example.vttp_project_backend.service.JobService;
import com.example.vttp_project_backend.service.UserService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("api/business")
public class BusinessRestController {

    @Autowired
    BizUserService bizUserService;

    @Autowired
    ApiService apiService;

    @Autowired
    JobService jobSvc;

    @Autowired
    UserService userService;

    @PostMapping("/new")
    public ResponseEntity<String> newJobPost(@RequestBody Job post) {
        Boolean isAdded = false;

        if (bizUserService.insertNewPost(post)) {
            isAdded = true;
            JsonObject resp = Json.createObjectBuilder()
                    .add("isAdded", isAdded)
                    .add("status", 200)
                    .build();
            return ResponseEntity.ok(resp.toString());
        }
        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 400)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/postings/{bizname}")
    public ResponseEntity<List<JobStat>> getStats(@PathVariable("bizname") String bizname) {
        List<JobStat> result = bizUserService.getPostings(bizname);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/update-time/{bizname}")
    public void updateLastChecked(@PathVariable("bizname") String bizname) {
        bizUserService.updateLastChecked(bizname);
    }

    @GetMapping("/unread/{bizname}")
    public ResponseEntity<String> fetchUnreadNotifications(@PathVariable("bizname") String bizname) {
        Boolean newNotitifications = false;

        List<String> toreturn = bizUserService.fetchUnreadNotifications(bizname); 

        if (toreturn.size() > 0) {
            newNotitifications = true;
            JsonObject resp = Json.createObjectBuilder()
                    .add("newNotifications", newNotitifications)
                    .add("list", toreturn.toString())
                    .add("status", 200)
                    .build();
            return ResponseEntity.ok(resp.toString());
        }
        JsonObject resp = Json.createObjectBuilder()
                .add("newNotitifications", newNotitifications)
                .add("status", 400)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/applicants/{jobid}")
    public ResponseEntity<List<Applicant>> getApplicants(@PathVariable("jobid") String jobid) {
        List<Applicant> allApplicants = bizUserService.getApplicants(jobid);

        return ResponseEntity.ok(allApplicants);
    }

    @GetMapping("/allapplicants")
    public ResponseEntity<List<EachApplicantSearch>> getApplicantsForSearch() {
        List<EachApplicantSearch> app = userService.getSearchAppUsers();

        return ResponseEntity.ok(app);
    }

    @PutMapping(path = "/update/{jobid}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateJob(@PathVariable("jobid") String jobid, @RequestBody Job job) {
        Boolean isUpdated = false;

        if (apiService.updateJob(job)) {
            isUpdated = true;
            JsonObject resp = Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .add("status", 200)
                    .build();
            return ResponseEntity.ok(resp.toString());
        }
        JsonObject resp = Json.createObjectBuilder()
                .add("isUpdated", isUpdated)
                .add("status", 400)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/promote/{jobid}")
    public ResponseEntity<String> promoteStatus(@PathVariable("jobid") String jobid) throws UpdatingException {
        Boolean isUpdated = false;

        if (jobSvc.updatePromoted(jobid)) {
            isUpdated = true;
            JsonObject resp = Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .add("status", 200)
                    .build();
            return ResponseEntity.ok(resp.toString());
        }
        JsonObject resp = Json.createObjectBuilder()
                .add("isUpdated", isUpdated)
                .add("status", 400)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("remove-job/{jobid}")
    public ResponseEntity<String> removeHistory(@PathVariable("jobid") String jobid) {
        Boolean isAdded = false;

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @PostMapping(path = "/jobwithlogo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> insertPostWithLogo(@RequestPart("job_type") String job_type, @RequestPart("title") String title,
            @RequestPart("description") String description,
            @RequestPart(name = "candidate_required_location", required = false) String candidate_required_location,
            @RequestPart("company_name") String company_name, @RequestPart(name = "tags", required = false) String tags,
            @RequestPart(name = "company_logo", required = false) MultipartFile company_logo)
            throws UpdatingException, IOException {

        Boolean isUpdated = false;

        Job job = new Job();
        job.setCompany_name(company_name);
        job.setDescription(description);
        job.setJob_type(job_type);
        job.setTitle(title);

        if (candidate_required_location != null) {
            String[] locationList = candidate_required_location.trim().split(",");
            List<String> locationSet = new ArrayList<>();
            for (String tag : locationList) {
                locationSet.add(tag.trim());
            }
            job.setCandidate_required_location(locationSet);
        }

        if (tags != null) {
            String[] tagsList = tags.trim().split(",");
            List<String> tagsSet = new ArrayList<>();
            for (String tag : tagsList) {
                tagsSet.add(tag.trim());
            }
            job.setTags(tagsSet);
        }

        try {
            isUpdated = jobSvc.insertPostWithLogo(company_logo.getInputStream(), company_logo.getContentType(),
                    company_logo.getSize(), job);

            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .build()
                    .toString());
        } catch (IOException ex) {
            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .build()
                    .toString());
        }
    }

}
