package com.demo.ebook.controller;

import com.demo.ebook.dto.BannerDTO;
import com.demo.ebook.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@CrossOrigin(origins = "*")
public class AdminBannerController {
    @Autowired
    private BannerService bannerService;

    @GetMapping
    public List<BannerDTO> getBanners() {
        return bannerService.getAllBanners();
    }

    @PostMapping
    public BannerDTO createBanner(@RequestParam("title") String title,
                                  @RequestParam(value = "link", required = false) String link,
                                  @RequestPart("image") MultipartFile imageFile) {
        return bannerService.createBanner(title, link, imageFile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Integer id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.ok().build();
    }
}