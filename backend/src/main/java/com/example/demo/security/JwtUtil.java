package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 秘密鍵（application.properties の jwt.secret = 環境変数 JWT_SECRET から読み込む）
    private final Key SECRET_KEY;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // HS256 には 32 バイト（半角32文字）以上の鍵が必要
        this.SECRET_KEY = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24時間

    // トークンを生成
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // トークンからユーザー名を取得
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // トークンからロールを取得
    public String extractRole(String token) {
        return (String) parseClaims(token).get("role");
    }

    // トークンの有効期限切れを確認
    public boolean isTokenValid(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
