package com.example.vttp_project_backend.service;

import com.example.vttp_project_backend.exceptions.RegistrationException;
import com.example.vttp_project_backend.models.*;
import com.example.vttp_project_backend.repo.UserRepo;
import com.example.vttp_project_backend.repo.s3Repo;
import com.github.f4b6a3.ulid.UlidCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.io.InputStream;
import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    s3Repo s3repo;

    public Boolean signupUser(Applicant newUser) throws RegistrationException {

        String newEmail = newUser.getEmail().trim().toLowerCase();

        Optional<Applicant> optApplicant = userRepo.getUserByEmail(newEmail);
        if (optApplicant.isPresent()) {
            throw new RegistrationException("Email is already registered.");
        }
        Boolean isAdded = userRepo.insertNewUser(newUser.getId(), newUser.getFirstName(), newUser.getLastName(),
                newUser.getEmail(),
                passwordEncoder.encode(CharBuffer.wrap(newUser.getPassword())));
        return isAdded;
    }

    public Boolean signupBusiness(Business newUser) throws RegistrationException {

        String newEmail = newUser.getCompany_email().trim().toLowerCase();

        Optional<Business> optVisitor = userRepo.getBusinessByEmail(newEmail);
        if (optVisitor.isPresent()) {
            throw new RegistrationException("Email is already registered.");
        }
        Boolean isAdded = userRepo.insertNewBusiness(newUser.getId(), newUser.getCompany_name(),
                newUser.getCompany_email(),
                passwordEncoder.encode(CharBuffer.wrap(newUser.getPassword())));
        return isAdded;
    }

    public String updatePicFile(InputStream resis, String rescontentType, long reslength, String userid) {
        String id = UlidCreator.getMonotonicUlid().toString();
        String resumeId = userid + "/profile" + id;
        String url = s3repo.saveToS3(resumeId, resis, rescontentType, reslength);

        userRepo.insertPicUrl(userid, url);
        return url;
    }

    public String updateResFile(InputStream resis, String rescontentType, long reslength, String userid) {
        String id = UlidCreator.getMonotonicUlid().toString();
        String resumeId = userid + "/resume" + id;
        String url = s3repo.saveToS3(resumeId, resis, rescontentType, reslength);
        userRepo.insertResUrl(userid, url);
        return url; 

    }

    public Boolean updateAppProfile(Applicant app) {
        return userRepo.updateAppProfile(app);
    }

    public Applicant getAppProfile(String id) {
        Optional<Applicant> optApplicant = userRepo.getUserById(id);
        if (optApplicant.isPresent()) {
            return optApplicant.get();
        }
        return null;
    }

    public List<Applicant> getAllAppUsers() {
        return userRepo.getAllAppUsers();
    }

    public List<EachApplicantSearch> getSearchAppUsers() {
        List<EachApplicantSearch> returnList = new ArrayList<>();

        List<Applicant> app =  userRepo.getAllAppUsers();


        for (Applicant a : app){
            EachApplicantSearch each = new EachApplicantSearch();
            each.setId(a.getId());
            each.setFirstName(a.getFirstName());
            each.setLastName(a.getLastName());
            each.setEmail(a.getEmail());
            each.setResume(a.getResume());
            each.setLocation(a.getLocation());
            each.setHeadline(a.getHeadline());
            each.setProfile_pic(a.getProfile_pic());
            each.setEmployments(this.getEmpHistories(a.getId()));
            each.setSkills(this.getUserSkills(a.getId()));

            returnList.add(each);
        }

        return returnList;
    }

    public List<Applicant> getAllAppByTerm(String search) {
        return userRepo.getAllAppByTerm(search);
    }

    public Boolean updateEmployment(String userid, EmpHistory values) {
        return userRepo.updateEmployment(userid, values); 
    } 

    public List<EmpHistory> getEmpHistories(String userid) {
        return userRepo.getEmpHistory(userid); 
    }

    public EmpHistory getEmpHistory(String histid) {
        Optional<EmpHistory> opt = userRepo.getOneHistory(histid);
        return opt.get();
    }

    public Boolean updateEmpHistory(EmpHistory values) {
        return userRepo.updateHist(values);
    }

    public Boolean updateBizPremiumStatus(String id) {
        return userRepo.updateBizPremiumStatus(id);
    }

    public Boolean removeHistory(String id) {
        return userRepo.removeHistory(id);
    } 

    public Boolean updateSkills(String id, List<Skill> values) {
         return userRepo.updateSkillset(id, values);
    }

    public List<Skill> getUserSkills(String userid) {
        return userRepo.getUserSkills(userid); 
    }

}
