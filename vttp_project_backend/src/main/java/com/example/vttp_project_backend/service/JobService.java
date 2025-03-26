package com.example.vttp_project_backend.service;

import com.example.vttp_project_backend.exceptions.UpdatingException;
import com.example.vttp_project_backend.models.AppliedJob;
import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.models.Skill;
import com.example.vttp_project_backend.models.Utils;
import com.example.vttp_project_backend.repo.BizJobRepo;
import com.example.vttp_project_backend.repo.JobRepo;
import com.example.vttp_project_backend.repo.ListingsRepo;
import com.example.vttp_project_backend.repo.s3Repo;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.composite.CompositeMeterRegistry;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class JobService {

    @Autowired
    JobRepo jobRepo;

    @Autowired
    s3Repo s3repo;

    @Autowired
    ListingsRepo listingsRepo;

    @Autowired
    BizJobRepo bizJobRepo;

    private Counter saveCounter;
    private Gauge memoryUsage;

    @Autowired
    private MeterRegistry meterRegistry;

    //    public JobService(CompositeMeterRegistry meterRegistry) {
//        saveCounter = meterRegistry.counter("save.count");
//        memoryUsage = Gauge.builder("myapp.memory.usage", Runtime.getRuntime(), Runtime::totalMemory)
//                           .description("Memory Usage")
//                           .register(meterRegistry);
//    }
    @PostConstruct
    public void init() {
        saveCounter = Counter.builder("save.count")
                .description("Number of saved bookmarks")
                .register(meterRegistry);

        memoryUsage = Gauge.builder("myapp.memory.usage", Runtime.getRuntime(), Runtime::totalMemory)
                .description("Memory Usage")
                .register(meterRegistry);

        // Add to init() method:
        Counter applicationCounter = Counter.builder("job.applications.count")
                .description("Number of job applications submitted")
                .register(meterRegistry);

        Timer applicationTimer = Timer.builder("job.application.time")
                .description("Time taken to process a job application")
                .register(meterRegistry);


    }

    @Transactional(rollbackFor = UpdatingException.class)
    public Boolean insertNewApplication(InputStream is, String contentType, long length, String userid, String jobid) throws UpdatingException {
        // Use Timer to measure execution time
        return Timer.builder("job.application.time")
                .description("Time taken to process a job application")
                .tag("jobId", jobid)  // Add useful tags for filtering
                .register(meterRegistry)
                .record(() -> {
                    try {
                        LocalDateTime currentDate = LocalDateTime.now().plusHours(8);
                        String resumeId = userid + "/" + jobid;
                        String url = s3repo.saveToS3(resumeId, is, contentType, length);

                        // Track S3 upload sizes
                        meterRegistry.counter("job.application.file.size")
                                .increment(length);

                        if ((jobRepo.insertNewApplication(resumeId, userid, jobid, url, currentDate)) &&
                                (jobRepo.increaseApplicationCount(jobid, currentDate))) {

                            // Increment the application counter
                            meterRegistry.counter("job.applications.count").increment();

                            return true;
                        } else {
                            throw new UpdatingException("You already applied for this job :)");
                        }
                    } catch (UpdatingException ex) {
                        // Increment a separate counter for duplicate applications
                        meterRegistry.counter("job.applications.duplicates").increment();
                        try {
                            throw ex;
                        } catch (UpdatingException e) {
                            throw new RuntimeException(e);
                        }
                    } catch (Exception ex) {
                        // Track other failures
                        meterRegistry.counter("job.applications.errors").increment();
                        try {
                            throw new UpdatingException("Error processing application: " + ex.getMessage());
                        } catch (UpdatingException e) {
                            throw new RuntimeException(e);
                        }
                    }
                });
    }

    public Boolean updateLastSeen(String jobid) {
        LocalDateTime currentDate = LocalDateTime.now().plusHours(8);
        return jobRepo.updateLastSeen(jobid, currentDate);
    }

    public List<AppliedJob> getAppliedJobs(String userId) {
        List<AppliedJob> jobIds = jobRepo.getAppliedByUserId(userId);

        for (AppliedJob j : jobIds) {
            Document doc = listingsRepo.getJobById(j.getId());

            if (doc == null) {
                System.err.println("⚠️ Job not found in MongoDB for ID: " + j.getId());
                continue;
            }

            Job job = Utils.toJob(doc);

            j.setCandidate_required_location(job.getCandidate_required_location());
            j.setJob_type(job.getJob_type());
            j.setTitle(job.getTitle());
            j.setCompany_logo(job.getCompany_logo());
            j.setCompany_name(job.getCompany_name());
            j.setTags(job.getTags());
        }

        return jobIds;
    }

    @Transactional(rollbackFor = UpdatingException.class)
    public Boolean insertNewBookmark(String userid, String jobid) throws UpdatingException {
        saveCounter.increment();
        if ((jobRepo.insertNewBookmark(userid, jobid)) && (jobRepo.increaseBookmarkCount(jobid))) {
            return true;
        } else {
            throw new UpdatingException("You already saved this job");
        }
    }

    public List<Job> getSavedJobs(String userId) {
        List<Long> jobIds = jobRepo.getSavedJobs(userId);

        List<Job> savedJobs = new ArrayList<>();
        for (Long j : jobIds) {
            Document doc = listingsRepo.getJobById(j);
            Job job = Utils.toJob(doc);
            savedJobs.add(job);
        }

        return savedJobs;
    }

    @Transactional(rollbackFor = UpdatingException.class)
    public Boolean removeSavedJob(String userid, String jobid) throws UpdatingException {
        if ((jobRepo.removeSavedJob(userid, jobid)) && (jobRepo.decreaseBookmarkCount(jobid))) {
            return true;
        } else {
            throw new UpdatingException("error removing bookmark");
        }
    }

    @Transactional(rollbackFor = UpdatingException.class)
    public Boolean updatePromoted(String id) throws UpdatingException {
        if (jobRepo.updatePromoted(id) && listingsRepo.updatePromoted(id) != null) {
            return true;
        } else {
            throw new UpdatingException("error updating promoted job status ");
        }
    }

    public List<Skill> getSkills() {
        return jobRepo.getSkills();
    }

    public Boolean insertPostWithLogo(InputStream is, String contentType, long length, Job post) {
        Random rand = new Random();
        Long jobid = 10000000 + rand.nextLong(90000000);
        post.setId(jobid);

        LocalDateTime currentDate = LocalDateTime.now().plusHours(8);
        post.setPublication_date(currentDate);

        String url = s3repo.saveToS3(jobid.toString(), is, contentType, length);
        post.setCompany_logo(url);

        if (bizJobRepo.hasCompany(post.getCompany_name())) {
            if ((listingsRepo.insertNewJob(post) != null) && (bizJobRepo.insertNewPost(post))) {
                return true;
            }
        }

        return false;
    }


}
