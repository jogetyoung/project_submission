package com.example.vttp_project_backend.controllers;

import com.example.vttp_project_backend.models.PaymentInfo;
import com.example.vttp_project_backend.service.StripeService;
import jakarta.json.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin
@RequestMapping(path = "/api/checkout")
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    @PostMapping
    public ResponseEntity<String> redirectToPayment(@RequestBody PaymentInfo payment) {
        String sessionId = stripeService.createPaymentLink(payment);
        
        return ResponseEntity.ok(Json.createObjectBuilder()
                .add("sessionId", sessionId)
                .build()
                .toString());
    }
    
}
