package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MemberDTO {
    private Integer id;
    private String account;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}