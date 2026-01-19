package com.demo.ebook.dto;

import lombok.Data;

@Data
public class UpdateEmployeeRequest {
    private String name;
    private String email;
    private String role;  // Allow updating role
}