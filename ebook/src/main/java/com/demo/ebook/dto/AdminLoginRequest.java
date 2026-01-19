package com.demo.ebook.dto;

import lombok.Data;

@Data
public class AdminLoginRequest {
    private String account;
    private String password;
}