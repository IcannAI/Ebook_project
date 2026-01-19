package com.demo.ebook.repository;

import com.demo.ebook.entity.Member;
import com.demo.ebook.entity.UserShippingInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserShippingInfoRepository extends JpaRepository<UserShippingInfo, Integer> {
    List<UserShippingInfo> findByUser(Member user);
}