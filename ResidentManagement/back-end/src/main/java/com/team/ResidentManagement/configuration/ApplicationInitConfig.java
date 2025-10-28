package com.team.ResidentManagement.configuration;

import com.team.ResidentManagement.constant.PredefinedRole;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.enums.Role;
import com.team.ResidentManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository) {
        return args -> {
               if(userRepository.findByUsername("admin").isEmpty()){

                   User user = User.builder()
                           .username("admin")
                           .password(passwordEncoder.encode("admin"))

                           .build();

                   userRepository.save(user);
               }
        };
    }
}
