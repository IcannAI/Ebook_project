package com.demo.ebook.repository;

import com.demo.ebook.entity.BookAuthor;
import com.demo.ebook.entity.BookAuthorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookAuthorRepository extends JpaRepository<BookAuthor, BookAuthorId> {

    // 自訂方法：根據書籍 ID 查詢所有關聯
    List<BookAuthor> findByBook_Id(Integer bookId);

    // 自訂方法：根據作者 ID 查詢所有關聯
    List<BookAuthor> findByAuthor_Id(Integer authorId);

    // 自訂方法：刪除特定書籍的所有作者關聯
    void deleteByBook_Id(Integer bookId);

    // 自訂方法：刪除特定作者的所有書籍關聯
    void deleteByAuthor_Id(Integer authorId);
}