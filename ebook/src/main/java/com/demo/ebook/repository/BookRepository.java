package com.demo.ebook.repository;

import com.demo.ebook.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Integer> {
	
	boolean existsByPublisherId(Integer publisherId);
    // 假設推薦書籍為特定查詢，例如 price < 300
    @Query("SELECT b FROM Book b WHERE b.price < 300") // 可替換為實際邏輯，如推薦標記
    List<Book> findRecommendedBooks1();
    
    // For recommended, assume custom query, e.g., based on stock > 0 and status = 1, limit 5
    @Query("SELECT b FROM Book b WHERE b.status = 1 AND b.stock > 0 ORDER BY b.createdAt DESC")
    List<Book> findRecommendedBooks(); // Or add limit in service

    Page<Book> findAll(Pageable pageable);
    
    //補書籍搜尋功能（影響前台體驗最大）
    Page<Book> findByTitleContainingIgnoreCaseOrIsbnContainingIgnoreCase(
    	    String title, String isbn, Pageable pageable);
    
    // 依出版社名稱模糊查詢書籍（後台搜尋用）
    @Query("SELECT b FROM Book b WHERE b.publisher.name LIKE %:keyword%")
    List<Book> findByPublisherNameContaining(@Param("keyword") String keyword);

    // 統計某出版社的書籍數量
    @Query("SELECT COUNT(b) FROM Book b WHERE b.publisher.id = :publisherId")
    long countByPublisherId(@Param("publisherId") Integer publisherId);
}