package com.demo.ebook.config;
import com.demo.ebook.filter.JwtAuthenticationFilter;
import jakarta.servlet.Filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration
public class SecurityConfig {
// 移除 AuthenticationManager，因為我們用 JWT 不需要傳統 form login
	
	//無循環風險
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth
	            .requestMatchers("/api/auth/**", "/api/admin/auth/**").permitAll()
	            .requestMatchers("/api/admin/**").hasRole("ADMIN")
	            .anyRequest().authenticated()
	        )
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);  // 使用 @Bean 的 Filter

	    return http.build();
	}

	private Filter jwtAuthenticationFilter() {
		// TODO Auto-generated method stub
		return null;
	}

	public JwtAuthenticationFilter getJwtAuthenticationFilter() {
		return jwtAuthenticationFilter;
	}

	public void setJwtAuthenticationFilter(JwtAuthenticationFilter jwtAuthenticationFilter) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	// 如果 Filter 已 @Component，可直接 @Autowired
	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;
}