package com.demo.ebook.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "publishers")
@Data
public class Publisher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String phone;

    // ...existing code...
}