package com.demo.ebook.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private MemberDTO member; // 這裡包含 id, name, account
}