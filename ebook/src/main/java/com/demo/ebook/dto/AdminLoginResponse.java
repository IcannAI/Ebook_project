package com.demo.ebook.dto;

import lombok.Data;

@Data
public class AdminLoginResponse {
    private String token;
    private EmployeeDTO employee;
}