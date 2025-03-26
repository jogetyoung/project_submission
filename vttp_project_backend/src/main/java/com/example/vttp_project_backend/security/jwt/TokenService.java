package com.example.vttp_project_backend.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.example.vttp_project_backend.security.model.ApplicantPrincipal;
import com.example.vttp_project_backend.security.model.BusinessPrincipal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {

    @Value("${jwt.key.secret}")
    private String secretKey;
    
    public String generateAppToken(ApplicantPrincipal auth) {
        Instant now = Instant.now();

        return JWT.create()
                .withIssuer("Fused")
                .withIssuedAt(now)
                .withSubject(String.valueOf(auth.getApplicant().getId()))
                .withExpiresAt(now.plus(1, ChronoUnit.HOURS))
                .withClaim("id", auth.getApplicant().getId())
                .withClaim("role", auth.getApplicant().getRole())
                .sign(Algorithm.HMAC256(secretKey));
    }

    public String generateBizToken(BusinessPrincipal auth) {
        Instant now = Instant.now();

        return JWT.create()
                .withIssuer("Fused")
                .withIssuedAt(now)
                .withSubject(String.valueOf(auth.getBusiness().getId()))
                .withExpiresAt(now.plus(1, ChronoUnit.HOURS))
                .withClaim("id", auth.getBusiness().getId())
                .withClaim("role", auth.getBusiness().getRole())
                .withClaim("premium", auth.getBusiness().getPremium())
                .sign(Algorithm.HMAC256(secretKey));
    }
    
}
