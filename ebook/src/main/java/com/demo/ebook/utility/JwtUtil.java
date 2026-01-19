package com.demo.ebook.utility;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

	// 使用冒號 : 提供預設值，避免配置文件漏寫時報錯
	@Value("${jwt.secret:default_secret_key_must_be_long_enough}")
    private String secret;

	// 同樣建議給過期時間一個預設值（例如 3600 秒）
	@Value("${jwt.expiration:3600}")
    private Long expiration;

	//原有參數版本
	@SuppressWarnings("deprecation")
	public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
	// 新增：支援 type 與 roles 的版本（主要使用這個）
    @SuppressWarnings("deprecation")
	public String generateToken(String account, String type, List<String> roles) {
        return Jwts.builder()
                .setSubject(account + ":" + type)          // 保持原 subject 格式
                .claim("type", type)                       // 額外 claim
                .claim("roles", roles)                     // List<String> 會自動序列化為 JSON array
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

	
    @SuppressWarnings("deprecation")
	public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }

    public String extractType(String token) {
        @SuppressWarnings("deprecation")
		Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
        return claims.get("type", String.class);
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        @SuppressWarnings("deprecation")
		Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
        return (List<String>) claims.get("roles");
    }

    public boolean validateToken(String token, String username) {
        return extractUsername(token).equals(username) && !isTokenExpired(token);
    }

    @SuppressWarnings("deprecation")
	private boolean isTokenExpired(String token) {
        return Jwts.parser().setSigningKey(secret)
                .parseClaimsJws(token).getBody().getExpiration().before(new Date());
    }
}