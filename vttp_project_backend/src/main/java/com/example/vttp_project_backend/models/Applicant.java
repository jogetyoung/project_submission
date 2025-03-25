package com.example.vttp_project_backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class Applicant {
    // private final String id;
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private final String role; 
    private String resume;
    private String location;
    private String profile_pic;
    private String headline; 
    private LocalDateTime applied_date;


    public Applicant() {
        // 26 characters
        // Eg - 01HNS6YMJNZX24G4YN38AGBZEE
        // id = UlidCreator.getMonotonicUlid().toString();
        role = "APPLICANT";
    }



}
