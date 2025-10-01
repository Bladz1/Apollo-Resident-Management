package com.friends.residentalManagement.dto.request;


import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateUserRequest {
    @Pattern(regexp = "\\d{12}", message = "Must be exactly 12 digits")
    String username;

    @Size(min = 8, max = 20)
    String password;

    String firstName;
    String lastName;
    String email;
    String phone;
    String address;
    LocalDate birthday;
}
