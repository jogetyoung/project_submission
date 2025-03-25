package com.example.vttp_project_backend.models;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Business {
    @Column(name = "id")
    private String id;

    @Column(name = "company_name")
    private String company_name;

    @Column(name = "company_email")
    private String company_email;

    @Column(name = "password")
    private String password;

    private final String role; 
    
    @Column(name = "premium")
    private Boolean premium;

    public Business() {
        // 26 characters
        // Eg - 01HNS6YMJNZX24G4YN38AGBZEE
        // id = UlidCreator.getMonotonicUlid().toString();
        role = "BUSINESS";
    }

    
}
