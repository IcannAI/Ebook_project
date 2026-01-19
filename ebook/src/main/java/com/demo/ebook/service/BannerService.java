package com.demo.ebook.service;

import com.demo.ebook.dto.BannerDTO;
import com.demo.ebook.entity.Banner;
import com.demo.ebook.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BannerService {
    @Autowired
    private BannerRepository bannerRepository;

    // Assume admin ID from auth
    private Integer getCurrentAdminId() {
        return 1; // Placeholder
    }

    public List<BannerDTO> getAllBanners() {
        return bannerRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public BannerDTO createBanner(String title, String link, MultipartFile imageFile) {
        Banner banner = new Banner();
        banner.setTitle(title);
        banner.setLink(link);
        banner.setImageUrl(saveFile(imageFile, "banners"));
        banner.setCreatedAt(LocalDateTime.now());
        banner.setAdminId(getCurrentAdminId());
        banner = bannerRepository.save(banner);
        return toDTO(banner);
    }

    public void deleteBanner(Integer id) {
        bannerRepository.deleteById(id);
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

    private BannerDTO toDTO(Banner banner) {
        BannerDTO dto = new BannerDTO();
        dto.setId(banner.getId());
        dto.setTitle(banner.getTitle());
        dto.setLink(banner.getLink());
        dto.setImageUrl(banner.getImageUrl());
        dto.setCreatedAt(banner.getCreatedAt());
        dto.setAdminId(banner.getAdminId());
        return dto;
    }
}