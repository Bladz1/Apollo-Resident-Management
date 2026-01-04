package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeedbackResponse {
    private String id;

    private String title;
    private String description;

    private String email;
    private String phone;
    private String address;

    private String attachmentUrl;

    private LocalDate createdAt;
}
