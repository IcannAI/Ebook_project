package com.demo.ebook.repository;

import com.demo.ebook.entity.BookAuthor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookAuthorRepository extends JpaRepository<BookAuthor, Integer> {

    // 自訂方法：根據書籍 ID 查詢所有關聯
    List<BookAuthor> findByBookId(Integer bookId);

    // 自訂方法：根據作者 ID 查詢所有關聯
    List<BookAuthor> findByAuthorId(Integer authorId);

    // 自訂方法：刪除特定書籍的所有作者關聯
    void deleteByBookId(Integer bookId);

    // 自訂方法：刪除特定作者的所有書籍關聯
    void deleteByAuthorId(Integer authorId);
}