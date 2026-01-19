package com.demo.ebook.repository;

import com.demo.ebook.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PublisherRepository extends JpaRepository<Publisher, Integer> {

    // 查詢全部出版社（後台列表、前端下拉）
    // JpaRepository 已提供 findAll()

    // 依名稱查詢（避免重複名稱）
    Optional<Publisher> findByName(String name);

    // 可選：不分大小寫查詢（後台搜尋用）
    List<Publisher> findByNameContainingIgnoreCase(String keyword);
    
    // 可選：依電話查詢（如果業務需要）
    Optional<Publisher> findByPhone(String phone);
}