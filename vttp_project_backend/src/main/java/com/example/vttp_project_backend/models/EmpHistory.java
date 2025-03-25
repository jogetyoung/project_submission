package com.example.vttp_project_backend.models;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmpHistory {
    
    String id;
    String title;
    String company;
    String job_description;
    String location;
    String job_type;
    String location_type;
    String start_month;
    String start_year;
    String end_month;
    String end_year;
    Boolean current_role;    
}
