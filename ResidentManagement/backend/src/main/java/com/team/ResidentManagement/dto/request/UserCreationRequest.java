package com.team.ResidentManagement.dto.request;

import com.team.ResidentManagement.validator.BirthdayConstraint;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {

    @Size(min = 3, max = 50, message = "USERNAME_INVALID")
    String username;

    @Size(min = 8, max = 100, message = "PASSWORD_INVALID")
    String password;

    String email;

    String address;

    String personalId;

    String phoneNumber;

    String gender;
    @BirthdayConstraint(min = 18, message = "INVALID_BIRTHDAY")
    LocalDate birthday;

}
