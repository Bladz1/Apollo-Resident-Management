package com.team.ResidentManagement.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Bao gói cấu trúc phản hồi chung gồm mã, thông điệp và dữ liệu.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ApiResponse <T> {
    @Builder.Default
    int code = 1000;

    String message;
    T result;

}
