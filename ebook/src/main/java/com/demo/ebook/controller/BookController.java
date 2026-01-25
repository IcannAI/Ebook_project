package com.demo.ebook.controller;

import com.demo.ebook.dto.BookDTO;
import com.demo.ebook.service.BookService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*") // 開發階段允許所有前端來源（含 http://localhost:5051）
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping("/api/books/recommended")
    public List<BookDTO> getRecommendedBooks() {
        return bookService.getRecommendedBooks();
    }

    @GetMapping("/api/books?page=&size=")
    public Page<BookDTO> getAllBooks(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size) {
        return bookService.getAllBooks(page, size);
    }
}