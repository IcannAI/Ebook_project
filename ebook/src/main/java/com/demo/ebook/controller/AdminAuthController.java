package com.demo.ebook.controller;

import com.demo.ebook.dto.AdminLoginRequest;
import com.demo.ebook.dto.AdminLoginResponse;
import com.demo.ebook.dto.AdminRegisterRequest;
import com.demo.ebook.dto.EmployeeDTO;
import com.demo.ebook.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin(origins = "*")
public class AdminAuthController {
    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/register")
    public ResponseEntity<EmployeeDTO> register(@RequestBody AdminRegisterRequest request) {
        return ResponseEntity.ok(employeeService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(employeeService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestParam String email) {
        employeeService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }
}