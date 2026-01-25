package com.demo.ebook.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name = "authors")
@Data
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String bio;

    @ManyToMany(mappedBy = "authors")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Set<Book> books;
}