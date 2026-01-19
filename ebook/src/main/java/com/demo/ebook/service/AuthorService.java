package com.demo.ebook.service;

import com.demo.ebook.dto.AuthorDTO;
import com.demo.ebook.entity.Author;
import com.demo.ebook.repository.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthorService {
    @Autowired
    private AuthorRepository authorRepository;

    public List<AuthorDTO> getAllAuthors() {
        return authorRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Add more methods if needed, e.g., create, update

    private AuthorDTO toDTO(Author author) {
        AuthorDTO dto = new AuthorDTO();
        dto.setId(author.getId());
        dto.setName(author.getName());
        dto.setBio(author.getBio());
        return dto;
    }
}