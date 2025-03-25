package com.example.vttp_project_backend.repo;

import com.example.vttp_project_backend.models.*;
import com.github.f4b6a3.ulid.UlidCreator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
public class UserRepo {

    @Autowired
    private JdbcTemplate template;

    @Autowired
    s3Repo s3Repo;

    public Boolean insertNewUser(String id, String firstName, String lastName, String email, String password) {
        return template.update(Queries.INSERT_NEW_USER, id, firstName, lastName, email, password) > 0;
    }

    public Optional<Applicant> getUserByEmail(String email) {
        List<Applicant> result = template.query(
                Queries.GET_USER_BY_EMAIL,
                BeanPropertyRowMapper.newInstance(Applicant.class), email);

        if (result.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(result.get(0));
        }
    }

    public Boolean insertNewBusiness(String id, String officialName, String email, String password) {
        return template.update(Queries.INSERT_NEW_BUSINESS,
                id, officialName, email, password) > 0; 
    }

    public Optional<Business> getBusinessByEmail(String email) {
        List<Business> result = template.query(
                Queries.GET_BUSINESS_BY_EMAIL,
                BeanPropertyRowMapper.newInstance(Business.class), email);

        if (result.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(result.get(0));
        }
    }

    public Optional<Applicant> getUserById(String id) {
        List<Applicant> result = template.query(
                Queries.GET_USER_BY_ID,
                BeanPropertyRowMapper.newInstance(Applicant.class), id);

        if (result.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(result.get(0));
        }
    }

    public Optional<JobStat> getJob(String id) {
        List<JobStat> result = template.query(
                Queries.GET_POST_BY_ID,
                BeanPropertyRowMapper.newInstance(JobStat.class), id);

        if (result.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(result.get(0));
        }
    }

    public Boolean insertPicUrl(String userid, String url) {
        return template.update(Queries.UPDATE_PIC_URL, url, userid) > 0;
    }

    public Boolean insertResUrl(String userid, String url) {
        return template.update(Queries.UPDATE_RES_URL, url, userid) > 0;
    }

    public Boolean updateAppProfile(Applicant app) {
        return template.update(Queries.UPDATE_APPLICANT_FIELDS, app.getFirstName(), app.getLastName(),
                app.getLocation(), app.getHeadline(), app.getId()) > 0;
    }

    public List<Applicant> getAllAppUsers() {
        List<Applicant> result = template.query(
                Queries.GET_ALL_USERS,
                BeanPropertyRowMapper.newInstance(Applicant.class));

        return result;
    }

    public List<Applicant> getAllAppByTerm(String search) {
        List<Applicant> result = template.query(
                Queries.GET_APP_BY_TERM,
                BeanPropertyRowMapper.newInstance(Applicant.class), "%" + search + "%");

        return result;
    }

    public Boolean updateEmployment(String userid, EmpHistory values) {
        String id = UlidCreator.getMonotonicUlid().toString();

        return template.update(Queries.INSERT_EMP_HIST, id, userid, values.getTitle(), values.getCompany(),
                values.getJob_description(), values.getLocation(), values.getJob_type(), values.getLocation_type(),
                values.getStart_month(), values.getStart_year(), values.getEnd_month(), values.getEnd_year(),
                values.getCurrent_role()) > 0;
    }

    public List<EmpHistory> getEmpHistory(String userid) {
        List<EmpHistory> result = template.query(
                Queries.GET_EMP_HIST_BY_USERID,
                BeanPropertyRowMapper.newInstance(EmpHistory.class), userid);

        return result;
    }

    public Optional<EmpHistory> getOneHistory(String id) {
        List<EmpHistory> result = template.query(
                Queries.GET_EMP_HIST_BY_ID,
                BeanPropertyRowMapper.newInstance(EmpHistory.class), id);

        if (result.isEmpty()) {
            return Optional.empty();
        } else {
            return Optional.of(result.get(0));
        }
    }

    public Boolean updateHist(EmpHistory values) {
        return template.update(Queries.UPDATE_EMP_HIST, values.getTitle(), values.getCompany(),
                values.getJob_description(), values.getLocation(), values.getJob_type(), values.getLocation_type(),
                values.getStart_month(), values.getStart_year(), values.getEnd_month(), values.getEnd_year(),
                values.getCurrent_role(), values.getId()) > 0;
    }

    public Boolean updateBizPremiumStatus(String id) {
        return template.update(Queries.UPDATE_BIZ_PREMIUM, id) > 0;
    }

    public Boolean removeHistory(String id) {
        return template.update(Queries.REMOVE_HIST, id) > 0;
    }

    public List<Skill> skillAlreadyAdded(String userid) {
        List<Skill> result = template.query(
                Queries.GET_SKILLS_BYUSERID,
                BeanPropertyRowMapper.newInstance(Skill.class), userid);

        return result;
    }

    public Boolean updateSkillset(String id, List<Skill> values) {
        List<Skill> existing = this.skillAlreadyAdded(id); 

        Set<Integer> existingSkillIds = existing.stream()
                .map(Skill::getId).collect(Collectors.toSet());

        for (Skill sk : values) {
            if (!existingSkillIds.contains(sk.getId())) {
                template.update(Queries.UPDATE_USERSKILL, id, sk.getId());
            }
        }

        return true;
    }

    public List<Skill> getUserSkills(String userid) {
        List<Skill> result = template.query(
                Queries.GET_SKILLS_BYUSERID,
                BeanPropertyRowMapper.newInstance(Skill.class), userid);

        return result;
    }

}
