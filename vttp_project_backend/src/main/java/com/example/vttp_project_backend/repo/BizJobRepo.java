package com.example.vttp_project_backend.repo;

import com.example.vttp_project_backend.models.Applicant;
import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.models.JobStat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;


import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BizJobRepo {

    @Autowired
    JdbcTemplate template;

    public Boolean hasCompany(String name) {
        int count = template.queryForObject(Queries.GET_COUNT_COMPANY, Integer.class, name);
        return count > 0;
    }

    public Boolean insertNewPost(Job job) {
        return template.update(Queries.INSERT_JOB_POST, job.getId(), job.getTitle(), job.getCompany_name(),
                job.getPublication_date()) > 0;
    }

    public List<JobStat> getPosts(String bizname) {
        List<JobStat> result = template.query(
                Queries.GET_POSTS_BY_COMP_NAME,
                BeanPropertyRowMapper.newInstance(JobStat.class), bizname);
        return result;
    }

    public Boolean updateLastChecked(LocalDateTime time, String bizname) {
        return template.update(Queries.UPDATE_TIME, time, bizname) > 0;
    }

    public LocalDateTime getLastChecked(String bizname) {
        SqlRowSet rs = template.queryForRowSet(Queries.GET_COMPANY_LASTCHECKED, bizname);
        while (rs.next()) {
            String last_checked = rs.getString("last_checked");
            if (last_checked != null){
                try {
                    LocalDateTime timing = LocalDateTime.parse(last_checked);
                    return timing;
                } catch (DateTimeException e) {
                    // Handle parsing exception
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public List<Applicant> getApplicantsForJob(String jobid){
        SqlRowSet rs = template.queryForRowSet(Queries.GET_APPLICANTS_BYJOBID, jobid);
        List<Applicant> allApplicants = new ArrayList<>(); 
        
        while (rs.next()) {
            Applicant app = new Applicant();
            
            String userid = rs.getString("id");
            String resume = rs.getString("resume_url");
            String firstName = rs.getString("first_name");
            String lastName = rs.getString("last_name");
            String profilepic = rs.getString("profile_pic");
            String email = rs.getString("email"); 
            String applied_date = rs.getString("applied_date");

            try {
                LocalDateTime timing = LocalDateTime.parse(applied_date);
                app.setApplied_date(timing);
            } catch (DateTimeException e) {
                e.printStackTrace();
            }

            app.setId(userid);
            app.setResume(resume);
            app.setFirstName(firstName);
            app.setLastName(lastName);
            app.setEmail(email);
            app.setProfile_pic(profilepic);
            allApplicants.add(app);
        }
        return allApplicants;
    }



}
