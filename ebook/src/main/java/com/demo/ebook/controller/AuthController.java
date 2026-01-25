package com.demo.ebook.controller;

import com.demo.ebook.dto.LoginRequest;
import com.demo.ebook.dto.LoginResponse;
import com.demo.ebook.dto.MemberDTO;
import com.demo.ebook.dto.RegisterRequest;
import com.demo.ebook.service.MemberService;
import com.demo.ebook.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	@Autowired
	private MemberService memberService;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * 會員註冊 POST /api/auth/register
	 */
	@PostMapping("/register")
	public ResponseEntity<MemberDTO> register(@RequestBody RegisterRequest request) {
		return ResponseEntity.ok(memberService.register(request));
	}

	/**
	 * 會員登入 POST /api/auth/login
	 */
	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
		return ResponseEntity.ok(memberService.login(request));
	}

	/**
	 * 取得目前登入中的會員資料 GET /api/auth/who 若尚未登入，回傳 401
	 */
	@GetMapping("/who")
	public ResponseEntity<MemberDTO> getWho(@RequestHeader("Authorization") String authHeader) {
		// 基本檢查
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	    }
		// 擷取 Token (去掉 "Bearer " 字串)
		String token = authHeader.substring(7);
		String account = jwtUtil.extractUsername(token);
		return ResponseEntity.ok(memberService.getProfile(account));
	}

	/**
	 * 忘記密碼 / 重設密碼 POST /api/auth/forgot-password
	 */
	@PostMapping("/forgot-password")
	public ResponseEntity<Void> forgotPassword(@RequestParam String email) {
		memberService.forgotPassword(email);
		return ResponseEntity.ok().build();
	}

	/**
	 * 新增登出端點 (供前端呼叫) POST /api/auth/logout
	 */
	@PostMapping("/logout")
	public ResponseEntity<Void> logout() {
		// JWT 登出只需前端移除 token，後端無需做什麼
		return ResponseEntity.ok().build();// 前端移除 token 即可
	}
}