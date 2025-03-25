package com.example.vttp_project_backend.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobStat {

    private Long id;
    private String title;
    private String company_name;
    private int applied;
    private int saved;
    private LocalDateTime publication_date;
    private LocalDateTime last_updated;
    private LocalDateTime last_seen;
    private Boolean promoted;
}
