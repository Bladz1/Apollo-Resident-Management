package com.team.ResidentManagement.dto.request;

import com.team.ResidentManagement.validator.BirthdayConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

/**
 * Dữ liệu từ client khi yêu cầu tạo mới cư dân.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    /** Tên đăng nhập tối thiểu 3 ký tự. */
    @Size(min = 3, max = 50, message = "USERNAME_INVALID")
    String username;

    /** Mật khẩu tối thiểu 8 ký tự. */
    @Size(min = 8, max = 100, message = "PASSWORD_INVALID")
    String password;

    String email;

    String address;

    String personalId;

    String phoneNumber;

    String gender;
    /** Ngày sinh, yêu cầu đủ 18 tuổi. */
    @BirthdayConstraint(min = 18, message = "INVALID_BIRTHDAY")
    LocalDate birthday;

}
