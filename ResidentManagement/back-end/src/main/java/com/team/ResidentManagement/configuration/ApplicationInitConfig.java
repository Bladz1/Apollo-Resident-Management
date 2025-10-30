package com.team.ResidentManagement.configuration;

import com.team.ResidentManagement.constant.PredefinedBill;
import com.team.ResidentManagement.constant.PredefinedRole;
import com.team.ResidentManagement.entity.Bill;
import com.team.ResidentManagement.entity.Role;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.repository.BillRepository;
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
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, BillRepository billRepository) {
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

               Bill transport = billRepository.save(Bill.builder()
                       .id(PredefinedBill.TRANSPORT)
                       .description("Bao gồm phí đăng ký phương tiện, phí cầu đường, phạt vi phạm giao thông.")
                       .build());

               Bill administrative = billRepository.save(Bill.builder()
                       .id(PredefinedBill.ADMINISTRATIVE)
                       .description("Bao gồm phí cấp hộ chiếu, lệ phí chứng thực, phí cấp giấy phép kinh doanh.")
                       .build());

               Bill healthSocial = billRepository.save(Bill.builder()
                       .id(PredefinedBill.HEALTH_SOCIAL)
                       .description("Bao gồm bảo hiểm y tế, phí khám chữa bệnh, phí cấp giấy khám sức khỏe.")
                       .build());

               var bills = new HashSet<Bill>();
               bills.add(transport);
               bills.add(healthSocial);
               bills.add(administrative);

               User user = User.builder()
                       .username(ADMIN_USER_NAME)
                       .roles(roles)
                       .bills(bills)
                       .password(passwordEncoder.encode(ADMIN_PASSWORD))
                       .build();

               userRepository.save(user);
           }
        };
    }
}
