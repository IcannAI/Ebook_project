package com.demo.ebook.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BannerDTO {
    private Integer id;
    private String title;
    private String link;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Integer adminId;
}