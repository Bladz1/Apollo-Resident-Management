package com.team.ResidentManagement.dto.response;

import com.team.ResidentManagement.entity.Bill;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String firstName;
    String lastName;
    LocalDate birthday;
    Set<RoleResponse> roles;
    Set<BillResponse> bills;
}
