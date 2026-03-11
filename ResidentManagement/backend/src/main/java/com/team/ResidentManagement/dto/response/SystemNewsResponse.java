package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SystemNewsResponse {
    String id;
    String title;
    String summary;
    String content;
    String version;
    LocalDateTime createdAt;
}
