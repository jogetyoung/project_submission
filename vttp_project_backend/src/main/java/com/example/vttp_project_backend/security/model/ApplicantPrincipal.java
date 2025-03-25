package com.example.vttp_project_backend.security.model;

import com.example.vttp_project_backend.models.Applicant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantPrincipal implements UserDetails {

    private Applicant applicant; // Stores the user (applicant) data


    /**
     * Retrieves the applicant's role and grants it as an authority.
     * This is used for role-based access control (RBAC).
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority(applicant.getRole()));
        return authorities;
    }

    /**
     * Returns the applicant's password for authentication.
     */
    @Override
    public String getPassword() {
        return applicant.getPassword();
    }

    /**
     * Returns the applicant's unique identifier (ID) as the username.
     */
    @Override
    public String getUsername() {
        return applicant.getId();
    }


    /**
     * Determines if the account is expired.
     * Currently, all accounts are considered active.
     */
    @Override
    public boolean isAccountNonExpired() { return applicant != null; }

    /**
     * Determines if the account is locked.
     * Currently, all accounts are considered unlocked.
     */
    @Override
    public boolean isAccountNonLocked() { return applicant != null; }

    /**
     * Determines if the credentials (password) are expired.
     * Currently, all credentials are considered valid.
     */
    @Override
    public boolean isCredentialsNonExpired() { return applicant != null; }

    /**
     * Determines if the user is enabled.
     * Currently, all users are considered enabled.
     */
    @Override
    public boolean isEnabled() {
        return applicant != null;
    }
}
