package com.demo.ebook.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private MemberDTO member;
}