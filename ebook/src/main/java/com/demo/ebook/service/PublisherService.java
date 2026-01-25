package com.demo.ebook.service;

import com.demo.ebook.dto.PublisherDTO;
import com.demo.ebook.entity.Publisher;
import com.demo.ebook.repository.BookRepository;
import com.demo.ebook.repository.PublisherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PublisherService {

    @Autowired
    private PublisherRepository publisherRepository;

    @Autowired
    private BookRepository bookRepository;
    
    // 取得所有出版社（前端下拉、書籍詳情用）
    public List<PublisherDTO> getAllPublishers() {
        return publisherRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // 依 ID 取得單一出版社
    public PublisherDTO getPublisherById(Integer id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));
        return toDTO(publisher);
    }

    // 新增出版社（後台）
    public PublisherDTO createPublisher(PublisherDTO dto) {
        // 防呆：檢查名稱是否已存在
        if (publisherRepository.findByName(dto.getName()).isPresent()) {
            throw new RuntimeException("出版社名稱已存在：" + dto.getName());
        }

        Publisher publisher = new Publisher();
        copyFromDTO(publisher, dto);

        publisher = publisherRepository.save(publisher);
        return toDTO(publisher);
    }

    // 更新出版社（後台）
    public PublisherDTO updatePublisher(Integer id, PublisherDTO dto) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found with id: " + id));

        // 檢查名稱是否重複（排除自己）
        Optional<Publisher> existing = publisherRepository.findByName(dto.getName());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new RuntimeException("出版社名稱已存在：" + dto.getName());
        }

        copyFromDTO(publisher, dto);

        publisher = publisherRepository.save(publisher);
        return toDTO(publisher);
    }

    // 刪除出版社（後台）
    public void deletePublisher(Integer id) {
        if (!publisherRepository.existsById(id)) {
            throw new RuntimeException("Publisher not found with id: " + id);
        }

        // 檢查是否有書籍關聯
        if (bookRepository.existsByPublisherId(id)) {
            throw new RuntimeException("無法刪除，此出版社仍有書籍關聯");
        }

        publisherRepository.deleteById(id);
    }

    // 手動複製（避免引入 Mapping 工具）
    private void copyFromDTO(Publisher entity, PublisherDTO dto) {
        entity.setName(dto.getName());
        entity.setPhone(dto.getPhone());
    }

    private PublisherDTO toDTO(Publisher entity) {
        PublisherDTO dto = new PublisherDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setPhone(entity.getPhone());
        return dto;
    }
}