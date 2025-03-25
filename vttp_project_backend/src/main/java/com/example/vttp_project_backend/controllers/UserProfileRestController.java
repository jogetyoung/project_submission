package com.example.vttp_project_backend.controllers;

import com.example.vttp_project_backend.models.Applicant;
import com.example.vttp_project_backend.models.EmpHistory;
import com.example.vttp_project_backend.models.Skill;
import com.example.vttp_project_backend.service.UserService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(path = "/user")
public class UserProfileRestController {

    @Autowired
    UserService userService;

    @PostMapping(path = "/profile-pic/{userid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateAppProfilePic(@PathVariable("userid") String userid,
            @RequestPart(name = "profile_pic", required = false) MultipartFile profile) {

        Boolean isUpdated = false; 
        String url;

        try {
            url = userService.updatePicFile(profile.getInputStream(), profile.getContentType(),profile.getSize(), userid);

            isUpdated = true;

            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .add("url", url)
                    .build().toString());
        } catch (IOException ex) {
            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated).build().toString());
        }

    }

    @PostMapping(path = "/resume/{userid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateAppProfileFile(@PathVariable("userid") String userid,
            @RequestPart(name = "resume", required = false) MultipartFile resume) {

        Boolean isUpdated = false;
        String url;
        try {
            url = userService.updateResFile(resume.getInputStream(), resume.getContentType(),
                    resume.getSize(), userid);
            isUpdated = true;

            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated)
                    .add("url", url)
                    .build().toString());
        } catch (IOException ex) {
            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("isUpdated", isUpdated).build().toString());
        }
    }

    @PostMapping(path = "/applicant/update/{userid}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateAppProfile(@PathVariable("userid") String userid,
            @RequestBody Applicant applicant) {

        Boolean isAdded = false;
        isAdded = userService.updateAppProfile(applicant);

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/applicant/{userid}")
    public ResponseEntity<Applicant> updateAppProfile(@PathVariable("userid") String userid) {
        Applicant app = userService.getAppProfile(userid);

        return ResponseEntity.ok(app);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Applicant>> getAll() {
        List<Applicant> app = userService.getAllAppUsers();

        return ResponseEntity.ok(app);
    }

    @GetMapping(path = "/search")
    public ResponseEntity<List<Applicant>> process(@RequestParam("search") String search) {
        List<Applicant> app = userService.getAllAppByTerm(search);
        return ResponseEntity.ok(app);
    }

    @PostMapping(path = "/employment/update/{userid}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateEmployment (@PathVariable("userid") String userid,
            @RequestBody EmpHistory values) {
        Boolean isAdded = false;
        isAdded = userService.updateEmployment(userid, values); 

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/employment-history/{userid}")
    public ResponseEntity<List<EmpHistory>> getEmploymentHistory(@PathVariable("userid") String userid) {
        List<EmpHistory> all = userService.getEmpHistories(userid);

        return ResponseEntity.ok(all);
    }


    @GetMapping("/gethistory/{histid}")
    public ResponseEntity<EmpHistory> getHistory(@PathVariable("histid") String histid) {
        EmpHistory all = userService.getEmpHistory(histid);

        return ResponseEntity.ok(all);
    }

    @PostMapping(path = "/updatehist/{histid}" , consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateHistory(@PathVariable("histid") String histid, @RequestBody EmpHistory values) {

        Boolean isAdded = false;
        isAdded = userService.updateEmpHistory(values); 

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }


    @GetMapping("remove-history/{histid}")
    public ResponseEntity<String> removeHistory(@PathVariable("histid") String histid) {

        Boolean isAdded = false;
        isAdded = userService.removeHistory(histid);

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @PostMapping(path = "/updateskills/{userid}" , consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateSkills(@PathVariable("userid") String userid, @RequestBody List<Skill> values) {
        Boolean isAdded = false;
        isAdded = userService.updateSkills(userid, values); 

        JsonObject resp = Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .add("status", 200)
                .build();

        return ResponseEntity.ok(resp.toString());
    }

    @GetMapping("/allskills/{userid}")
    public ResponseEntity<List<Skill>> getUserSkills(@PathVariable("userid") String userid) {
        List<Skill> all = userService.getUserSkills(userid);

        return ResponseEntity.ok(all);
    }


}
