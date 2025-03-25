package com.example.vttp_project_backend.security.model;

import com.example.vttp_project_backend.models.Business;
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
public class BusinessPrincipal implements UserDetails {

    private Business business;
    

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<GrantedAuthority>();
        authorities.add(new SimpleGrantedAuthority(business.getRole()));
        return authorities;
    }

    @Override
    public String getPassword() {
        return business.getPassword();
    }

    @Override
    public String getUsername() {
        return business.getId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return business != null;
    }

    @Override
    public boolean isAccountNonLocked() {
        return business != null;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return business != null;
    }

    @Override
    public boolean isEnabled() { 
        return business != null;
    }
    
}
