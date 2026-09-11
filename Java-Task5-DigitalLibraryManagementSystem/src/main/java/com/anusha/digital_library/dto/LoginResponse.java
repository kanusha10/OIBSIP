package com.anusha.digital_library.dto;

import com.anusha.digital_library.entity.Role;

public class LoginResponse {

    private Long id;
    private String username;
    private String displayName;
    private Role role;

    public LoginResponse(Long id, String username, String displayName, Role role) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public Role getRole() {
        return role;
    }
}