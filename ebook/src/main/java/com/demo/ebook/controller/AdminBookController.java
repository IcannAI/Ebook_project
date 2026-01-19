package com.demo.ebook.controller;

import com.demo.ebook.dto.BookDTO;
import com.demo.ebook.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/books")
@CrossOrigin(origins = "*")
public class AdminBookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public Page<BookDTO> getBooks(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size) {
        return bookService.getAllBooks(page, size);
    }

    @GetMapping("/{id}")
    public BookDTO getBook(@PathVariable Integer id) {
        return bookService.getBookById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookDTO createBook(@RequestPart("book") BookDTO bookDTO,
                              @RequestPart(value = "cover", required = false) MultipartFile coverFile) {
        return bookService.createBook(bookDTO, coverFile);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public BookDTO updateBook(@PathVariable Integer id,
                              @RequestPart("book") BookDTO bookDTO,
                              @RequestPart(value = "cover", required = false) MultipartFile coverFile) {
        return bookService.updateBook(id, bookDTO, coverFile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
}