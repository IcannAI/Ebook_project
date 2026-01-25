package com.demo.ebook.service;

import com.demo.ebook.dto.UserShippingInfoDTO;
import com.demo.ebook.entity.Member;
import com.demo.ebook.entity.UserShippingInfo;
import com.demo.ebook.repository.UserShippingInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShippingService {

    @Autowired
    private UserShippingInfoRepository repository;

    private Member getCurrentUser() {
        // 取得當前登入會員
        return (Member) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * 取得當前會員的所有配送地址
     */
    public List<UserShippingInfoDTO> getShippingInfos() {
        Member user = getCurrentUser();
        return repository.findByUser(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 新增一筆配送地址
     */
    public UserShippingInfoDTO addShippingInfo(String methodName, String address, String phone) {
        Member user = getCurrentUser();
        UserShippingInfo info = new UserShippingInfo();
        info.setUser(user);
        info.setMethodName(methodName);
        info.setAddress(address);
        info = repository.save(info);
        return toDTO(info);
    }

    /**
     * 刪除一筆配送地址
     */
    public void deleteShippingInfo(Integer id) {
        // 可選：加上權限檢查，確認該地址屬於當前使用者
        repository.deleteById(id);
    }

    private UserShippingInfoDTO toDTO(UserShippingInfo info) {
        UserShippingInfoDTO dto = new UserShippingInfoDTO();
        dto.setId(info.getId());
        dto.setMethodName(info.getMethodName());
        dto.setAddress(info.getAddress());
        return dto;
    }
}