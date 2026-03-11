package com.team.ResidentManagement.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SystemNewsRequest {
    String title;
    String summary;
    String content;
    String version;
}
