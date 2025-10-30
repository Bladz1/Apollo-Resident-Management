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
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_USER_NAME = "admin";
    @NonFinal
    static final String ADMIN_PASSWORD = "admin";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
           if (userRepository.findByUsername(ADMIN_USER_NAME).isEmpty()) {
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
                       .username(ADMIN_USER_NAME)
                       .roles(roles)
                       .password(passwordEncoder.encode(ADMIN_PASSWORD))
                       .build();

               userRepository.save(user);
           }
        };
    }
}
