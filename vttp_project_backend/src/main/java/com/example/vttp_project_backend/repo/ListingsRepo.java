package com.example.vttp_project_backend.repo;

import com.example.vttp_project_backend.models.Job;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ListingsRepo {

    @Autowired
    MongoTemplate mongoTemplate;

    public void insertJobs(List<Job> jobList) {
        List<Document> jobDocuments = new ArrayList<>();
        for (Job j : jobList) {
            Document d = new Document();
            d.append("_id", j.getId());
            d.append("title", j.getTitle());
            d.append("company_name", j.getCompany_name());
            d.append("category", j.getCategory());
            d.append("job_type", j.getJob_type());
            d.append("candidate_required_location", j.getCandidate_required_location());
            d.append("description", j.getDescription());
            d.append("company_logo", j.getCompany_logo());
            d.append("publication_date", j.getPublication_date());
            d.append("promoted", j.getPromoted());
            d.append("promoted_time", j.getPromoted_time());
            d.append("tags", j.getTags());

            Query query = Query.query(Criteria.where("_id").is(j.getId()));
            if (mongoTemplate.exists(query, Document.class, "remotejobs")) {
                Update update = new Update();
                update.set("title", j.getTitle());
                update.set("company_name", j.getCompany_name());
                update.set("category", j.getCategory());
                update.set("job_type", j.getJob_type());
                update.set("candidate_required_location", j.getCandidate_required_location());
                update.set("description", j.getDescription());
                update.set("company_logo", j.getCompany_logo());

                update.set("tags", j.getTags());

                mongoTemplate.updateFirst(query, update, "remotejobs");
            } else {
                mongoTemplate.insert(d, "remotejobs");
            }
        }
    }

    public List<Document> getAllJobs() {
        Query query = new Query().with(Sort.by(Sort.Direction.DESC, "promoted").and(Sort.by(Sort.Direction.DESC, "publication_date")));

        List<Document> docs = mongoTemplate.find(query, Document.class, "remotejobs");
        return docs;
    }

    public Document getJobById(Long id) {
        Criteria criteria = Criteria.where("_id").is(id);
        Query query = Query.query(criteria);
        return mongoTemplate.findOne(query, Document.class, "remotejobs");
    }

    public List<Document> searchJobsByTerms(String search) {
        Criteria criteria = Criteria.where("title")
                .regex(search, "i").and("description").regex(search, "i");
        Query query = Query.query(criteria);
        return mongoTemplate.find(query, Document.class, "remotejobs");
    }

    public List<Document> getJobsByName(String name) {
        Criteria criteria = Criteria.where("company_name").is(name);
        Query query = Query.query(criteria);
        return mongoTemplate.find(query, Document.class, "remotejobs");
    }

    public Document getJobByCompanyName(String name) {
        Criteria criteria = Criteria.where("company_name").is(name);
        Query query = Query.query(criteria);
        return mongoTemplate.findOne(query, Document.class, "remotejobs");
    }

    public Document insertNewJob(Job j) {
        Document d = new Document();
        d.append("_id", j.getId());
        d.append("title", j.getTitle());
        d.append("company_name", j.getCompany_name());
        d.append("job_type", j.getJob_type());
        d.append("candidate_required_location", j.getCandidate_required_location());
        d.append("description", j.getDescription());
        d.append("company_logo", j.getCompany_logo());
        d.append("publication_date", j.getPublication_date());
        d.append("promoted", j.getPromoted());
        d.append("promoted_time", j.getPromoted_time());
        d.append("tags", j.getTags()); 

        return mongoTemplate.insert(d, "remotejobs");
    }

    public Document updateJob(Long id, Document doc) {
        return mongoTemplate.findAndReplace(Query.query(Criteria.where("_id").is(id)), doc, "remotejobs");
    }

    @Scheduled(cron = "0 0 0 * * *") // Run daily at midnight
    public void updateBooleanField() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minus(1, ChronoUnit.WEEKS);

        Query query = new Query(Criteria.where("promoted_time").lt(oneWeekAgo));
        Update update = Update.update("promoted", false);

        mongoTemplate.updateMulti(query, update, Document.class);
    }

    public Document updatePromoted(String id) {

        Long longid = Long.parseLong(id);
        LocalDateTime currentDate = LocalDateTime.now().plusHours(8);

        Document updatedDocument = mongoTemplate.findAndModify(
                Query.query(Criteria.where("_id").is(longid)),
                new Update().set("promoted", true).set("promoted_time", currentDate),
                Document.class,
                "remotejobs");
        return updatedDocument;

    }

    public Boolean removeJob(Long id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        try {
            mongoTemplate.remove(query, "remotejobs");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
