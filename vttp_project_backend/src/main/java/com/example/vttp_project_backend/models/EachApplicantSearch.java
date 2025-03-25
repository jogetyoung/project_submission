package com.example.vttp_project_backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EachApplicantSearch {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String resume;
    private String location;
    private String profile_pic; 
    private String headline; 
    private List<Skill> skills;
    private List<EmpHistory> employments;
}

