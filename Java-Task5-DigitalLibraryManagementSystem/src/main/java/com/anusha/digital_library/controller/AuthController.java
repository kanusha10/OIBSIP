package com.anusha.digital_library.controller;

import com.anusha.digital_library.dto.LoginRequest;
import com.anusha.digital_library.dto.LoginResponse;
import com.anusha.digital_library.dto.RegisterResponse;
import com.anusha.digital_library.entity.User;
import com.anusha.digital_library.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody User user) {

        User savedUser = userService.register(user);

        RegisterResponse response = new RegisterResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getDisplayName()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        User user = userService.login(
                request.getUsername(),
                request.getPassword()
        );

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getRole()
        );

        return ResponseEntity.ok(response);
    }
}