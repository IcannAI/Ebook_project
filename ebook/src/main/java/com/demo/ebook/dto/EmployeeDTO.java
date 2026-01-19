package com.demo.ebook.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EmployeeDTO {
    private Integer id;
    private String account;
    private String name;
    private String email;
    private String role;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}