package com.demo.ebook.repository;

import com.demo.ebook.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByAccount(String account);
    Optional<Member> findByEmail(String email);
}