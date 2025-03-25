package com.example.vttp_project_backend.service;

import com.example.vttp_project_backend.models.Job;
import com.example.vttp_project_backend.models.Utils;
import com.example.vttp_project_backend.repo.JobRepo;
import com.example.vttp_project_backend.repo.ListingsRepo;
import jakarta.json.*;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import java.io.StringReader;
import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ApiService {

    @Value("${jobapi}")
    private String jobApi;

    RestTemplate template = new RestTemplate();

    @Autowired
    ListingsRepo jobsRepo;

    @Autowired
    JobRepo SQLRepo;

    private static final String[] countries = {
            "Brazil", "Kenya", "Mexico", "USA", "Spain", "Greece", "Colombia", "Belgium", "Japan", "India",
            "Philippines", "UK", "Worldwide", "Hungary", "Egypt", "Germany", "Europe", "Portugal", "Canada",
            "Australia", "Latvia", "Argentina", "Romania", "Chile", "Turkey", "Puerto Rico",
            "Northern America", "Costa Rica", "Austria", "Poland", "France", "Georgia", "Serbia", "Armenia",
            "Ukraine", "Singapore", "Venezuela", "New Zealand", "Switzerland", "Africa", "Finland", "EMEA",
            "Italy", "Ireland", "Slovakia", "Vietnam", "Morocco", "Western Europe", "Hong Kong", "South Africa",
            "Algeria", "Cameroon", "Dominican Republic", "Ecuador", "Ghana", "Peru", "China", "Sri Lanka",
            "Croatia", "Pakistan", "Thailand", "Indonesia", "Bangladesh", "Cambodia", "Laos", "Malaysia",
            "Nepal", "North Macedonia", "United Arab Emirates", "Estonia", "South America", "El Salvador",
            "Trinidad and Tobago", "Burkina Faso", "Sweden", "Uruguay", "Caribbean", "Asia", "Netherlands",
            "Eritrea", "Bulgaria", "Denmark", "Montenegro", "Central America", "Guatemala", "Northern Europe",
            "Slovenia", "Eastern Europe", "South Korea"
    };

    public List<Job> readApi() {
        List<Job> allJobs = new ArrayList<>();
        ResponseEntity<String> result = template.getForEntity(jobApi, String.class);
        String jsonString = result.getBody().toString();
        JsonReader jsonReader = Json.createReader(new StringReader(jsonString));
        JsonObject jsonObject = jsonReader.readObject();
        JsonArray jsonArray = jsonObject.getJsonArray("jobs");
        Set<String> uniqueTags = new HashSet<>();
        for (JsonValue jsonV : jsonArray) {
            Job job = new Job();
            JsonObject js = jsonV.asJsonObject();

            JsonArray jsontags = js.getJsonArray("tags");

            List<String> allTags = new ArrayList<>();
            for (int i = 0; i < jsontags.size(); i++) {
                allTags.add(jsontags.getString(i).toUpperCase());
                uniqueTags.add(jsontags.getString(i).toUpperCase());
            }
            job.setTags(allTags);

            job.setId(js.getJsonNumber("id").longValue());
            job.setTitle(js.getString("title"));
            job.setCompany_name(js.getString("company_name"));
            job.setCompany_logo(js.getString("company_logo"));
            job.setCategory(js.getString("category"));

            String type = js.getString("job_type");
            if (type != null) {
                if (type.equals("full_time")) {
                    job.setJob_type("Full Time");
                } else if (type.equals("part_time")) {
                    job.setJob_type("Part Time");
                } else if (type.equals("freelance")) {
                    job.setJob_type("Freelance");
                } else if (type.equals("internship")) {
                    job.setJob_type("Internship");
                } else if (type.equals("contract")) {
                    job.setJob_type("Contract");
                } else {
                    job.setJob_type(type);
                }
            }

            String cf = js.getString("candidate_required_location");
            if (cf != null) {
                String[] tagsArray = cf.trim().split(",");
                List<String> filteredTags = new ArrayList<>();
                for (String tag : tagsArray) {
                    if (Arrays.asList(countries).contains(tag.trim())) {
                        filteredTags.add(tag.trim());
                    }
                }

                if (!filteredTags.isEmpty()) {
                    job.setCandidate_required_location(filteredTags);
                } else {
                    continue;
                }
            }

            job.setDescription(js.getString("description"));

            String publicationDateStr = js.getString("publication_date");
            try {
                LocalDateTime publicationDateTime = LocalDateTime.parse(publicationDateStr);
                job.setPublication_date(publicationDateTime);
            } catch (DateTimeException e) {
                e.printStackTrace();
            }

            allJobs.add(job);
        }
        System.out.println("UNIQUE TAGS>>>> " + uniqueTags);
        jobsRepo.insertJobs(allJobs);
        SQLRepo.insertJobsFromApi(allJobs);
        return allJobs;
    }

    public List<Job> getAllJobs() {
        List<Job> jobs = new ArrayList<>();
        List<Document> docs = jobsRepo.getAllJobs();
        for (Document doc : docs) {
            Job newJob = Utils.toJob(doc);
            jobs.add(newJob);
        }
        return jobs;
    }

    public Job getJobById(Long id) {
        Document doc = jobsRepo.getJobById(id);
        return Utils.toJob(doc);
    }

    public List<Job> getJobByName(String company) {
        List<Document> docs = jobsRepo.searchJobsByTerms(company);
        List<Job> allJobs = new ArrayList<>();
        for (Document doc : docs) {
            Job newJob = Utils.toJob(doc);
            allJobs.add(newJob);
        }
        return allJobs;
    }

    public Job getJobByCompanyName(String name) {
        Document doc = jobsRepo.getJobByCompanyName(name);
        if (doc == null) {
            return null; // Return null instead of trying to convert a null document
        }
        return Utils.toJob(doc);
    }

    public Boolean updateJob(Job job) {
        Document retreivedDoc = jobsRepo.getJobById(job.getId());

        retreivedDoc.remove("title");
        retreivedDoc.append("title", job.getTitle());

        retreivedDoc.remove("job_type");
        retreivedDoc.append("job_type", job.getJob_type());

        retreivedDoc.remove("candidate_required_location");
        retreivedDoc.append("candidate_required_location", job.getCandidate_required_location());

        retreivedDoc.remove("description");
        retreivedDoc.append("description", job.getDescription());

        if ((jobsRepo.updateJob(job.getId(), retreivedDoc) != null) && (SQLRepo.updateTitle(job))) {
            System.out.println("BOTH UPDATED PROPERLY");
            return true;
        }
        System.out.println("DIDNT UPDATE PROPERLY");

        return false;
    }

    public Boolean removeJob(Long id) {
        if (jobsRepo.removeJob(id) && SQLRepo.removeJob(id)) {
            return true;
        }
        return false;

    }

}
