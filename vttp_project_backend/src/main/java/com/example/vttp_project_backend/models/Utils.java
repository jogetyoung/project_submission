package com.example.vttp_project_backend.models;

import org.bson.Document;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class Utils {

  public static Job toJob(Document doc) {
    Job job = new Job();
    job.setId(doc.getLong("_id"));
    job.setTitle(doc.getString("title"));
    job.setCompany_name(doc.getString("company_name"));
    job.setCategory(doc.getString("category"));
    job.setJob_type(doc.getString("job_type"));
    job.setCandidate_required_location(doc.getList("candidate_required_location", String.class));
    job.setDescription(doc.getString("description"));
    job.setCompany_logo(doc.getString("company_logo"));
    Date pubD = doc.getDate("publication_date");

    Instant instant = pubD.toInstant();

    LocalDateTime publicationDateTime = instant.atZone(ZoneId.systemDefault()).toLocalDateTime();
    job.setPublication_date(publicationDateTime);

    job.setPromoted(doc.getBoolean("promoted"));
    Date promoD = doc.getDate("promoted_time");

    if (promoD !=null){
      Instant instant2 = promoD.toInstant();
  
      LocalDateTime promoDateTime = instant2.atZone(ZoneId.systemDefault()).toLocalDateTime();
      job.setPromoted_time(promoDateTime);
    }

    job.setTags(doc.getList("tags", String.class));

    return job;
  }
}