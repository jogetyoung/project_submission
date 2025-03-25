package com.example.vttp_project_backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppliedJob {

    private Long id;
    private String title;
    private String company_name;
    private String job_type;
    private List<String> candidate_required_location;
    private List<String> tags;
    private String description;
    private String company_logo; 
    private LocalDateTime appliedDateTime;
}
