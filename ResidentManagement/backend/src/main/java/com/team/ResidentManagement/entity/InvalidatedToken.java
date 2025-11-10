package com.team.ResidentManagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

/**
 * Token đã bị thu hồi nhằm ngăn chặn tái sử dụng sau khi đăng xuất.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InvalidatedToken {

    /** Chuỗi token JWT bị vô hiệu hoá. */
    @Id
    String token;
    /** Thời điểm token hết hạn tự nhiên. */
    Date expireTime;
}
