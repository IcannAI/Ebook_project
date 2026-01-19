package com.demo.ebook.controller;

import com.demo.ebook.dto.PublisherDTO;
import com.demo.ebook.service.PublisherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publishers")
@CrossOrigin(origins = "*")
public class PublisherController {

    @Autowired
    private PublisherService publisherService;

    /**
     * 前台 + 後台共用：取得所有出版社（供前端下拉選單、書籍詳情使用）
     */
    @GetMapping
    public List<PublisherDTO> getAllPublishers() {
        return publisherService.getAllPublishers();
    }

    /**
     * 後台：依 ID 取得單一出版社
     */
    @GetMapping("/{id}")
    public PublisherDTO getPublisher(@PathVariable Integer id) {
        return publisherService.getPublisherById(id);
    }

    /**
     * 後台：新增出版社
     */
    @PostMapping
    public PublisherDTO createPublisher(@RequestBody PublisherDTO dto) {
        return publisherService.createPublisher(dto);
    }

    /**
     * 後台：更新出版社
     */
    @PutMapping("/{id}")
    public PublisherDTO updatePublisher(@PathVariable Integer id, @RequestBody PublisherDTO dto) {
        return publisherService.updatePublisher(id, dto);
    }

    /**
     * 後台：刪除出版社
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublisher(@PathVariable Integer id) {
        publisherService.deletePublisher(id);
        return ResponseEntity.ok().build();
    }
}