package com.demo.ebook.repository;

import com.demo.ebook.entity.Book;
import com.demo.ebook.entity.CartItem;
import com.demo.ebook.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

	// 查詢某位會員的所有購物車項目
    List<CartItem> findByUser(Member user);

    // 加入這一行，讓 Spring Data JPA 自動產生查詢
    // 查詢某位會員的某一本書是否已在購物車
    Optional<CartItem> findByUserAndBook(Member user, Book book);

    // 清空某位會員的購物車
    void deleteByUser(Member user);
}