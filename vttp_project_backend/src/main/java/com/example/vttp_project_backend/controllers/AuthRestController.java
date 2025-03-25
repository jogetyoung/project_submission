package com.example.vttp_project_backend.controllers;

import com.example.vttp_project_backend.exceptions.InvalidPasswordException;
import com.example.vttp_project_backend.exceptions.RegistrationException;
import com.example.vttp_project_backend.exceptions.UserNotFoundException;
import com.example.vttp_project_backend.models.Applicant;
import com.example.vttp_project_backend.models.Business;
import com.example.vttp_project_backend.models.LoginUser;
import com.example.vttp_project_backend.security.jwt.AuthService;
import com.example.vttp_project_backend.security.jwt.TokenService;
import com.example.vttp_project_backend.security.model.ApplicantPrincipal;
import com.example.vttp_project_backend.security.model.BusinessPrincipal;
import com.example.vttp_project_backend.service.UserService;
import com.github.f4b6a3.ulid.UlidCreator;
import jakarta.json.Json;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("api/auth")
public class AuthRestController {

    @Autowired
    UserService userService;

    @Autowired
    private TokenService tokenSvc;

    @Autowired
    private AuthService authService;

    @PostMapping(path = "/applicant-signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> appSignup(@RequestBody Applicant applicant) throws RegistrationException {
        String id = UlidCreator.getMonotonicUlid().toString();
        applicant.setId(id);
        return ResponseEntity.ok(Json.createObjectBuilder()
                .add("isAdded", userService.signupUser(applicant).toString())
                .build()
                .toString());
    }

    @PostMapping(path = "/business-signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> businessSignup(@RequestBody Business business) throws RegistrationException {
        String id = UlidCreator.getMonotonicUlid().toString();
        business.setId(id);
        return ResponseEntity.ok(Json.createObjectBuilder()
                .add("isAdded", userService.signupBusiness(business).toString())
                .build()
                .toString());
    }

    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> login(@RequestBody LoginUser auth)
            throws UserNotFoundException, InvalidPasswordException {

        if (auth.getRole().equals("APPLICANT")) {
            ApplicantPrincipal loggedInUser = authService.loginApplicant(auth);
            String token = tokenSvc.generateAppToken(loggedInUser);

            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("token", token)
                    .add("id", loggedInUser.getUsername())
                    .add("role", loggedInUser.getApplicant().getRole())
                    .add("email", loggedInUser.getApplicant().getEmail())
                    .add("firstName", loggedInUser.getApplicant().getFirstName())
                    .add("lastName", loggedInUser.getApplicant().getLastName()) 
                    .add("resume", loggedInUser.getApplicant().getResume() != null ? loggedInUser.getApplicant().getResume() : "null") 
                    .add("location", loggedInUser.getApplicant().getLocation() != null ? loggedInUser.getApplicant().getLocation() : "null") 
                    .add("profile_pic", loggedInUser.getApplicant().getProfile_pic() != null ? loggedInUser.getApplicant().getProfile_pic() : "null") 
                    .add("headline", loggedInUser.getApplicant().getHeadline() != null ? loggedInUser.getApplicant().getHeadline() : "null") 
                    .build()
                    .toString());
        }

        if (auth.getRole().equals("BUSINESS")) {
            BusinessPrincipal loggedInUser = authService.loginBusiness(auth);
            String token = tokenSvc.generateBizToken(loggedInUser);
            return ResponseEntity.ok(Json.createObjectBuilder()
                    .add("token", token)
                    .add("id", loggedInUser.getBusiness().getId())
                    .add("role", loggedInUser.getBusiness().getRole())
                    .add("email", loggedInUser.getBusiness().getCompany_email())
                    .add("officialName", loggedInUser.getBusiness().getCompany_name())
                    .add("premium", loggedInUser.getBusiness().getPremium())
                    .build()
                    .toString());
        }
        return null;
    }

    @GetMapping(path = "/update/{bizid}")
    public ResponseEntity<String> updateBizPremiumStatus(@PathVariable("bizid") String bizid) {
        Boolean isAdded = false; 

        isAdded = userService.updateBizPremiumStatus(bizid); 

        return ResponseEntity.ok(Json.createObjectBuilder()
                .add("isAdded", isAdded)
                .build()
                .toString());
    }

}
