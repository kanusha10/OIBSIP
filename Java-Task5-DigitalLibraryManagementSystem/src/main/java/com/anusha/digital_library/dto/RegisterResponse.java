package com.anusha.digital_library.dto;

public class RegisterResponse {

    private String message;
    private Long id;
    private String username;
    private String displayName;

    public RegisterResponse(String message, Long id,
                            String username, String displayName) {
        this.message = message;
        this.id = id;
        this.username = username;
        this.displayName = displayName;
    }

    public String getMessage() {
        return message;
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
}