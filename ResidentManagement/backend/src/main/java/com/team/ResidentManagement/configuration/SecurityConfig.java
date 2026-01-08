package com.team.ResidentManagement.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Cấu hình Spring Security cho ứng dụng bao gồm phân quyền, JWT và CORS.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    /** Danh sách endpoint không yêu cầu xác thực. */
    private final String[] PUBLIC_ENDPOINT = {"/users", "/auth/token", "/auth/introspect", "/auth/logout", "/auth/refresh"};

    /** Khoá bí mật dùng để ký và xác thực token JWT. */
    @Value("${jwt.signer-key}")
    private String signerKey;


    /** Trình giải mã JWT tuỳ chỉnh để kiểm tra chữ ký và trích xuất claims. */
    @Autowired
    CustomJwtDecoder customJwtDecoder;

    /**
     * Định nghĩa chuỗi filter chính cho bảo mật HTTP.
     * @param httpSecurity builder cấu hình bảo mật.
     * @return SecurityFilterChain dùng bởi Spring Security.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request ->
                request.requestMatchers(PUBLIC_ENDPOINT)
                        .permitAll()
                        .anyRequest()
                        .authenticated());

        httpSecurity.oauth2ResourceServer(oauth2 ->
            oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                    .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                    .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );

        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        httpSecurity.cors(Customizer.withDefaults());

        return httpSecurity.build();
    }

    /**
     * Cấu hình CORS để frontend có thể gọi API trong môi trường phát triển.
     */
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.addAllowedOrigin("http://localhost:3000");
        corsConfiguration.addAllowedOrigin("https://resident-management.vercel.app");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

    /**
     * Tuỳ biến cách ánh xạ quyền hạn từ token JWT.
     */
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    /**
     * Bộ mã hoá mật khẩu dùng thuật toán BCrypt với strength = 10.
     */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
