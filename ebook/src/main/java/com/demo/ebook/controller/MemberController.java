package com.demo.ebook.controller;

import com.demo.ebook.dto.ChangePasswordRequest;
import com.demo.ebook.dto.MemberDTO;
import com.demo.ebook.dto.UpdateProfileRequest;
import com.demo.ebook.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {
	@Autowired
	private MemberService memberService;

	/**
	 * 
	 * 取得會員資料 GET /api/members/profile
	 */
	@GetMapping("/profile")
	public MemberDTO getProfile(Authentication authentication) {
		return memberService.getProfile(authentication.getName());
	}

	/**
	 * 
	 * 更新會員資料 PUT /api/members/profile
	 */
	@PutMapping("/profile")
	public MemberDTO updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
		return memberService.updateProfile(authentication.getName(), request);
	}

	/**
	 * 
	 * 忘記密碼 / 重設密碼 PUT /api/members/password
	 */
	@PutMapping("/password")
	public ResponseEntity<Void> changePassword(Authentication authentication,
			@RequestBody ChangePasswordRequest request) {
		memberService.changePassword(authentication.getName(), request);
		return ResponseEntity.ok().build();
	}

	/**
	 * 
	 * 刪除帳號 DELETE /api/members/profile
	 */
	@DeleteMapping("/profile")
	public ResponseEntity<Void> deleteAccount(Authentication authentication) {
		memberService.deleteAccount(authentication.getName());
		return ResponseEntity.ok().build();
	}
}