package com.team.ResidentManagement.configuration;

import com.team.ResidentManagement.constant.PredefinedRole;
import com.team.ResidentManagement.entity.Role;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.repository.RoleRepository;
import com.team.ResidentManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

/**
 * Cấu hình khởi tạo dữ liệu mặc định cho ứng dụng khi lần đầu chạy.
 * Đảm bảo hệ thống có tối thiểu một tài khoản admin và các vai trò cơ bản.
 */
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    /**
     * Bộ mã hoá mật khẩu được Spring inject để tạo tài khoản mặc định an toàn.
     */
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${admin.email:admin@resident.com}")
    String adminEmail;

    @NonFinal
    @Value("${admin.password}")
    String adminPassword;

    @NonFinal
    @Value("${admin.cccd:000000000000}")
    String adminCccd;

    @NonFinal
    @Value("${admin.phone:0999999999}")
    String adminPhone;

    /**
     * Bean ApplicationRunner khởi tạo dữ liệu người dùng và vai trò mặc định khi
     * ứng dụng chạy lần đầu.
     * 
     * @param userRepository repository thao tác bảng người dùng.
     * @param roleRepository repository thao tác bảng vai trò.
     * @return hàm lambda chạy sau khi Spring Boot khởi động.
     */
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (userRepository.findByEmail(adminEmail).isEmpty()) {
                roleRepository.save(Role.builder()
                        .name(PredefinedRole.USER_ROLE)
                        .description("User role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(PredefinedRole.ADMIN_ROLE)
                        .description("Admin role")
                        .build());

                var roles = new HashSet<Role>();
                roles.add(adminRole);

                User user = User.builder()
                        .email(adminEmail)
                        .fullName("System Administrator")
                        .personalId(adminCccd)
                        .phoneNumber(adminPhone)
                        .roles(roles)
                        .password(passwordEncoder.encode(adminPassword))
                        .status("ACCEPTED")
                        .build();

                userRepository.save(user);
            } else {
                userRepository.findByEmail(adminEmail).ifPresent(u -> {
                    boolean updated = false;
                    if (u.getPersonalId() == null || u.getPhoneNumber() == null) {
                        u.setPersonalId(adminCccd);
                        u.setPhoneNumber(adminPhone);
                        updated = true;
                    }
                    if (updated) {
                        userRepository.save(u);
                    }
                });
            }
        };
    }
}
