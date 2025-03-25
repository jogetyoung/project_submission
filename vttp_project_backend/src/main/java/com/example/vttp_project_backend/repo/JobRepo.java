package com.example.vttp_project_backend.repo;

import com.example.vttp_project_backend.models.AppliedJob;
import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.models.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;


import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class JobRepo {

    @Autowired
    private JdbcTemplate template;

    public void insertJobsFromApi(List<Job> allJobs) {
        for (Job job : allJobs) {
            try {
                // Check if the job already exists
                SqlRowSet rs = template.queryForRowSet("SELECT COUNT(*) FROM job_post WHERE id = ?", job.getId());
                rs.next();
                int count = rs.getInt(1);

                if (count == 0) {
                    // Insert only if the job doesn't exist
                    template.update(Queries.INSERT_JOB_POST,
                            job.getId(), job.getTitle(), job.getCompany_name(), job.getPublication_date());
                } else {
                    // Optionally update if the job exists
                    template.update("UPDATE job_post SET title = ?, company_name = ? WHERE id = ?",
                            job.getTitle(), job.getCompany_name(), job.getId());
                }
            } catch (Exception e) {
                // Log the error but continue processing other jobs
                System.err.println("Error processing job ID " + job.getId() + ": " + e.getMessage());
            }
        }
    }

    public Boolean insertNewApplication(String resumeId, String userid, String jobid, String url, LocalDateTime currentDate ) {
        if(this.alreadyApplied(resumeId)){
            return false;
        }
        return template.update(Queries.INSERT_INTO_USER_APPLIED, resumeId, userid, jobid, url, currentDate) > 0;
    }

    public Boolean alreadyApplied(String resumeId){
        SqlRowSet rs = template.queryForRowSet(Queries.HAVE_APPLIED, resumeId);
        while (rs.next()) {
            return true;
        }
        return false;
    }

    public List<AppliedJob> getAppliedByUserId(String userId){
        SqlRowSet rs = template.queryForRowSet(Queries.GET_APPLIED_JOBS, userId);
        List<AppliedJob> jobIds = new ArrayList<>();
        while (rs.next()) {
            AppliedJob appliedJob = new AppliedJob();
            Long jobid = rs.getLong("job_id");
            appliedJob.setId(jobid);

            String applied_date = rs.getString("applied_date");
            if (applied_date != null){
                try {
                    LocalDateTime timing = LocalDateTime.parse(applied_date);
                    appliedJob.setAppliedDateTime(timing);
                } catch (DateTimeException e) {
                    e.printStackTrace();
                }
            }

            jobIds.add(appliedJob);
        }

        return jobIds;
    }

    public Boolean insertNewBookmark(String userid, String jobid) {
        if(this.alreadySaved(userid, jobid)){
            return false;
        }
        return template.update(Queries.INSERT_INTO_USER_SAVED, userid, jobid) > 0;
    }

    public Boolean alreadySaved(String userid, String jobid){
        SqlRowSet rs = template.queryForRowSet(Queries.HAVE_SAVED, userid, jobid);

        while (rs.next()) {
            return true;
        }

        return false;
    }

    public List<Long> getSavedJobs(String userId){
        SqlRowSet rs = template.queryForRowSet(Queries.GET_SAVED_JOBS, userId);
        List<Long> jobIds = new ArrayList<>();

        while (rs.next()) {
            Long jobid = rs.getLong("job_id");
            jobIds.add(jobid);
        }

        return jobIds;
    }


    public Boolean removeSavedJob(String userid, String jobid) {
        return template.update(Queries.DELETE_SAVED_JOB, userid, jobid) > 0; 
    }

    public Boolean increaseApplicationCount(String jobid, LocalDateTime currentDate){
        return template.update(Queries.INCREASE_APP_COUNT, currentDate, jobid) >0;
    }

    public Boolean updateLastSeen(String jobid, LocalDateTime currentDate){
        return template.update(Queries.UPDATE_APPLICANT_LAST_SEEN, currentDate, jobid) >0;
    }

    public Boolean increaseBookmarkCount(String jobid){
        return template.update(Queries.INCREASE_BOOKMARK_COUNT, jobid)>0;
    }

    public Boolean decreaseBookmarkCount(String jobid){
        return template.update(Queries.DECREASE_BOOKMARK_COUNT, jobid)>0;
    }

    public Boolean updateTitle(Job job) {
        return template.update(Queries.UPDATE_TITLE, job.getTitle(), job.getId()) > 0;
    }

    public Boolean updatePromoted( String id){
        return template.update(Queries.UPDATE_PROMOTED, id) > 0;
    }

    public List<Skill> getSkills(){
        SqlRowSet rs = template.queryForRowSet(Queries.GET_ALL_SKILLS);
        List<Skill> allSkills = new ArrayList<>();

        while (rs.next()) {
            Skill skill = new Skill();
            Integer id = rs.getInt("id");
            String skillName = rs.getString("skill_name");
            skill.setId(id);
            skill.setSkill_name(skillName);
            allSkills.add(skill);
        }
        return allSkills;
    }

    public Boolean removeJob(Long id){
        template.update(Queries.REMOVE_JOB_FROM_APPLIED, id ); 
        template.update(Queries.REMOVE_JOB_FROM_SAVED, id ); 

        return template.update(Queries.REMOVE_JOB, id )>0; 
    }


}
