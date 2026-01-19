package com.demo.ebook.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String account;
    private String password;
}