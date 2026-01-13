package com.team.ResidentManagement.dto.request;

import com.team.ResidentManagement.validator.BirthdayConstraint;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String password;
    String gender;
    String email;
    String address;
    String personalId;
    String phoneNumber;

    @BirthdayConstraint(min = 18, message = "INVALID_BIRTHDAY")
    LocalDate birthday;

    List<String> roles;
    List<String> fees;
}
