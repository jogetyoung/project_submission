package com.example.vttp_project_backend.service;

import com.example.vttp_project_backend.models.Applicant;
import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.models.JobStat;
import com.example.vttp_project_backend.repo.BizJobRepo;
import com.example.vttp_project_backend.repo.ListingsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class BizUserService {

    @Autowired
    ListingsRepo listingsRepo;

    @Autowired
    BizJobRepo bizJobRepo;

    public Boolean insertNewPost(Job post) {
        Random rand = new Random();
        Long jobid = 10000000 + rand.nextLong(90000000);
        post.setId(jobid); 

        LocalDateTime currentDate = LocalDateTime.now().plusHours(8); 
        post.setPublication_date(currentDate);

        if (bizJobRepo.hasCompany(post.getCompany_name())) {
            if ((listingsRepo.insertNewJob(post) != null) && (bizJobRepo.insertNewPost(post))) {
                return true;
            }
        }

        return false;
    }

    public List<JobStat> getPostings(String bizname) {
        return bizJobRepo.getPosts(bizname);

    }

    public void updateLastChecked(String companyName) {
        LocalDateTime currentDate = LocalDateTime.now().plusHours(8);
        bizJobRepo.updateLastChecked(currentDate, companyName);
    }

    public List<String> fetchUnreadNotifications(String companyName) { 
        List<JobStat> jobs = bizJobRepo.getPosts(companyName);

        List<String> toreturn = new ArrayList<>();

        for (JobStat job : jobs) {

            if (job.getLast_updated() != null && (job.getLast_seen() == null || job.getLast_updated().isAfter(job.getLast_seen()))) {
                toreturn.add(String.valueOf(job.getId()));  // Assuming job.getId() returns something suitable for string conversion
            }
        }
        System.out.println("to return" +toreturn.size());
    
        return toreturn;
    }

    public long calculateTimeDifference(LocalDateTime lastCheckedTime, LocalDateTime currentTime) {
        Duration duration = Duration.between(lastCheckedTime, currentTime);
        return duration.toSeconds();
    }

    public List<Applicant> getApplicants(String jobid) {
        return bizJobRepo.getApplicantsForJob(jobid); 
    }
    
}
