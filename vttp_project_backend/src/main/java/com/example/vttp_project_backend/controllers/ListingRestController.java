package com.example.vttp_project_backend.controllers;

import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.service.ApiService;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ListingRestController {

    @Autowired
    ApiService jobSvc;

    @GetMapping("/getjobs")
    public ResponseEntity<List<Job>> getJobs(){
        List<Job> allJobs= jobSvc.getAllJobs();
        return ResponseEntity.ok(allJobs); 
    }

    @GetMapping("/job/{id}")
    public ResponseEntity<Job> jobDetails(@PathVariable Long id) {
        Job job = jobSvc.getJobById(id);
        return ResponseEntity.ok(job);
    }

//    @GetMapping(path = "/logo")
//    public ResponseEntity<Job> jobDetails(@RequestParam("name") String name) {
//        Job job = jobSvc.getJobByCompanyName(name);
//        return ResponseEntity.ok(job);
//    }

    @GetMapping(path = "/logo")
    public ResponseEntity<?> jobDetails(@RequestParam("name") String name) {
        try {
            Job job = jobSvc.getJobByCompanyName(name);
            if (job == null) {
                // Return a 404 Not Found if no job is found with the company name
                return ResponseEntity.status(404).body("Company logo not found");
            }
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/remove/{id}")
    public ResponseEntity<String> removeJob(@PathVariable Long id) {
        Boolean isRemoved = false;

        isRemoved = jobSvc.removeJob(id); 

        JsonObject resp = Json.createObjectBuilder()
                .add("isRemoved", isRemoved)
                .add("status", 200)
                .build(); 

        return ResponseEntity.ok(resp.toString());
    }
}


