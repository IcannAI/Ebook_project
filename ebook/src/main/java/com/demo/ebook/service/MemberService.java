package com.demo.ebook.service;

import com.demo.ebook.dto.*;
import com.demo.ebook.entity.Member;
import com.demo.ebook.repository.MemberRepository;
import com.demo.ebook.utility.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MemberService {

	@Autowired
	private MemberRepository memberRepository;

	@Autowired
	private JwtUtil jwtUtil;

	// Register註冊
	public MemberDTO register(RegisterRequest request) {
		if (memberRepository.findByAccount(request.getAccount()).isPresent()) {
			throw new RuntimeException("Account exists");
		}
		if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new RuntimeException("Email exists");
		}

		Member member = new Member();
		member.setAccount(request.getAccount());
		member.setPassword(request.getPassword()); // 直接存明文
		member.setName(request.getName());
		member.setEmail(request.getEmail());
		member.setPhone(request.getPhone());
		member.setStatus((byte) 1);
		member.setCreatedAt(LocalDateTime.now());
		member = memberRepository.save(member);
		return toDTO(member);
	}

	// Login登入
	public LoginResponse login(LoginRequest request) {
    	Member member = memberRepository.findByAccount(request.getAccount())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

    	if (!request.getPassword().equals(member.getPassword())) {
        	throw new RuntimeException("Invalid credentials");
    	}

    	member.setLastLogin(LocalDateTime.now());
    	memberRepository.save(member);

    	String token = jwtUtil.generateToken(
        	member.getAccount(),
       		"user",
        	List.of("ROLE_USER")
    );

    	LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setMember(toDTO(member));
        return response;
	}


	// Get Profile獲取帳號
	public MemberDTO getProfile(String account) {
		Member member = memberRepository.findByAccount(account)
				.orElseThrow(() -> new RuntimeException("Member not found: " + account));
		return toDTO(member);
	}

	// Update Profile更新帳號
	public MemberDTO updateProfile(String account, UpdateProfileRequest request) {
		Member member = memberRepository.findByAccount(account).orElseThrow();
		if (request.getName() != null)
			member.setName(request.getName());
		if (request.getEmail() != null) {
			if (memberRepository.findByEmail(request.getEmail()).isPresent()
					&& !request.getEmail().equals(member.getEmail())) {
				throw new RuntimeException("Email exists");
			}
			member.setEmail(request.getEmail());
		}
		if (request.getPhone() != null)
			member.setPhone(request.getPhone());
		if (request.getAddress() != null)
			member.setAddress(request.getAddress());
		member.setUpdatedAt(LocalDateTime.now());
		member = memberRepository.save(member);
		return toDTO(member);
	}

	// Change Password更改密碼
	public void changePassword(String account, ChangePasswordRequest request) {
		Member member = memberRepository.findByAccount(account).orElseThrow();
		member.setPassword(request.getNewPassword()); // 直接存明文
		member.setUpdatedAt(LocalDateTime.now());
		memberRepository.save(member);
	}

	// Delete Account刪除帳號
	public void deleteAccount(String account) {
		Member member = memberRepository.findByAccount(account).orElseThrow();
		memberRepository.delete(member);
	}

	// Forgot Password忘記密碼
	public void forgotPassword(String email) {
		Member member = memberRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Email not found"));
		String newPass = UUID.randomUUID().toString().substring(0, 12); // Generate random pass
		member.setPassword(newPass); // 直接存明文
		member.setUpdatedAt(LocalDateTime.now());
		memberRepository.save(member);

		// Simulate send email: System.out.println("New password: " + newPass);
		// In real: use JavaMailSender to send email
	}

	private MemberDTO toDTO(Member member) {
		MemberDTO dto = new MemberDTO();
		dto.setId(member.getId());
		dto.setAccount(member.getAccount());
		dto.setName(member.getName());
		dto.setEmail(member.getEmail());
		dto.setPhone(member.getPhone());
		dto.setAddress(member.getAddress());
		dto.setStatus(member.getStatus());
		dto.setCreatedAt(member.getCreatedAt());
		dto.setLastLogin(member.getLastLogin());
		return dto;
	}
}