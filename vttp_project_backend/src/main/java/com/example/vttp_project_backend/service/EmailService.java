package com.example.vttp_project_backend.service;

import com.example.vttp_project_backend.models.Applicant;
import com.example.vttp_project_backend.models.JobStat;
import com.example.vttp_project_backend.repo.UserRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;


import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {


    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.host}")
    private String hostEmail;

    @Autowired
    @Qualifier("webApplicationContext")
    private ResourceLoader resourceLoader;

    @Autowired
    UserRepo userRepo;

    public Applicant getUserById(String id) {
        return userRepo.getUserById(id).get();
    }

    public JobStat getJob(String id) {
        return userRepo.getJob(id).get();
    }

    public void sendApplicationNotification(String to, String jobTitle, String companyName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(hostEmail);
            helper.setTo(to);
            helper.setSubject("Job Application Confirmation - Nomad Nest");

            String htmlContent = loadEmailTemplate(jobTitle, companyName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException | IOException e) {
            e.printStackTrace();
        }
    }

    private String loadEmailTemplate(String jobTitle, String companyName) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:templates/email-template.html");

        try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            String templateContent = FileCopyUtils.copyToString(reader);
            return templateContent
                    .replace("{{JOB_TITLE}}", escapeHtml(jobTitle))
                    .replace("{{COMPANY_NAME}}", escapeHtml(companyName));
        }
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}
