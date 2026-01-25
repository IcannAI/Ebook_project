package com.demo.ebook.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.math.BigDecimal;

@Entity
@Table(name = "books")
@Data
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 20)
    private String isbn;

    @Column(nullable = false, length = 255)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_category_id")
    private SubCategory subCategory;

    @Column(name = "publish_date")
    private LocalDate publishDate;

    @Column(precision = 10, scale = 2, nullable = false)
    private java.math.BigDecimal price;

    @Column(nullable = false)
    private Integer stock;

    @Column(name = "discount", precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.valueOf(1.00);

    @Column(nullable = false)
    private String description;

    @Column(name = "cover_image", length = 255)
    private String coverImage;

    @Column(nullable = false)
    private Byte status; // 0: 下架, 1: 上架

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @Column(name = "updated_by_admin_id")
    private Integer updatedByAdminId;

    @ManyToMany
    @JoinTable(name = "book_authors", joinColumns = @JoinColumn(name = "book_id"), inverseJoinColumns = @JoinColumn(name = "author_id"))
    private Set<Author> authors = new HashSet<>();
}