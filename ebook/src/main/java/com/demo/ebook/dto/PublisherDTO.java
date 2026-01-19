package com.demo.ebook.dto;

import lombok.Data;

@Data
public class PublisherDTO {
    private Integer id;
    private String name;
    private String phone;
    private String address;
    private String email;
    private String website;
}