package com.demo.ebook.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String newPassword;
}