package com.demo.ebook.service;

import com.demo.ebook.dto.BookDTO;
import com.demo.ebook.entity.Author;
import com.demo.ebook.entity.Book;
import com.demo.ebook.entity.Publisher;
import com.demo.ebook.entity.SubCategory;
import com.demo.ebook.repository.AuthorRepository;
import com.demo.ebook.repository.BookRepository;
import com.demo.ebook.repository.PublisherRepository;
import com.demo.ebook.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    // Assume admin ID from authentication
    private Integer getCurrentAdminId() {
        // From SecurityContext
        return 1; // Placeholder
    }

    public Page<BookDTO> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findAll(pageable).map(this::toDTO);
    }

    public BookDTO getBookById(Integer id) {
        Book book = bookRepository.findById(id).orElseThrow();
        return toDTO(book);
    }

    public BookDTO createBook(BookDTO request, MultipartFile coverFile) {
        Book book = new Book();
        updateBookFromDTO(book, request);
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());
        book.setUpdatedByAdminId(getCurrentAdminId());
        if (coverFile != null) {
            book.setCoverImage(saveFile(coverFile, "books"));
        }
        book = bookRepository.save(book);
        return toDTO(book);
    }

    public BookDTO updateBook(Integer id, BookDTO request, MultipartFile coverFile) {
        Book book = bookRepository.findById(id).orElseThrow();
        updateBookFromDTO(book, request);
        book.setUpdatedAt(LocalDateTime.now());
        book.setUpdatedByAdminId(getCurrentAdminId());
        if (coverFile != null) {
            book.setCoverImage(saveFile(coverFile, "books"));
        }
        book = bookRepository.save(book);
        return toDTO(book);
    }

    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }

    public List<BookDTO> getRecommendedBooks() {
        return bookRepository.findRecommendedBooks().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void updateBookFromDTO(Book book, BookDTO dto) {
        book.setTitle(dto.getTitle());
        book.setIsbn(dto.getIsbn());
        book.setPrice(dto.getPrice());
        book.setStock(dto.getStock());
        book.setDescription(dto.getDescription());
        book.setStatus(dto.getStatus());
        
        // 新增：出版日期
        book.setPublishDate(dto.getPublishDate());

        // 新增：折扣係數
        book.setDiscount(dto.getDiscount());
        
        if (dto.getPublisherId() != null) {
            Publisher publisher = publisherRepository.findById(dto.getPublisherId()).orElseThrow();
            book.setPublisher(publisher);
        }
        if (dto.getSubCategoryId() != null) {
            SubCategory subCategory = subCategoryRepository.findById(dto.getSubCategoryId()).orElseThrow();
            book.setSubCategory(subCategory);
        }
        if (dto.getAuthorIds() != null) {
            Set<Author> authors = dto.getAuthorIds().stream()
                    .map(authorId -> authorRepository.findById(authorId).orElseThrow())
                    .collect(Collectors.toSet());
            book.setAuthors(authors);
        }
        
        //接收時驗證折扣係數
        if (dto.getDiscount() != null && (dto.getDiscount() < 0 || dto.getDiscount() > 1)) {
            throw new IllegalArgumentException("折扣係數必須在 0~1 之間");
        }
        
        //加空值檢查
        if (dto.getPublishDate() != null) book.setPublishDate(dto.getPublishDate());
        if (dto.getDiscount() != null) book.setDiscount(dto.getDiscount());
        
    }

    private String saveFile(MultipartFile file, String folder) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            String path = "src/main/resources/static/images/" + folder + "/" + fileName;
            file.transferTo(new File(path));
            return "/images/" + folder + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("File save failed");
        }
    }

    // 修正：Entity → DTO 時，補上新欄位
    private BookDTO toDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setIsbn(book.getIsbn());
        dto.setPrice(book.getPrice());
        dto.setStock(book.getStock());
        dto.setDescription(book.getDescription());
        dto.setCoverImage(book.getCoverImage());
        dto.setStatus(book.getStatus());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setUpdatedAt(book.getUpdatedAt());
        dto.setUpdatedByAdminId(book.getUpdatedByAdminId());
        
        // 新增：出版日期
        dto.setPublishDate(book.getPublishDate());

        // 新增：折扣係數
        dto.setDiscount(book.getDiscount());
        
        if (book.getPublisher() != null) dto.setPublisherId(book.getPublisher().getId());
        if (book.getSubCategory() != null) dto.setSubCategoryId(book.getSubCategory().getId());
        dto.setAuthorIds(book.getAuthors().stream().map(Author::getId).collect(Collectors.toSet()));
        return dto;
    }
}