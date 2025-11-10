package com.team.ResidentManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * Thực thể lưu thông tin tội phạm bị truy nã.
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Wanted {

    /** Định danh duy nhất của hồ sơ truy nã. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    /** Tên chính thức của đối tượng truy nã. */
    @Column(name = "wantedName", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String wantedName;

    /** Biệt danh thường sử dụng. */
    String alias;
    /** Danh sách tội danh đối tượng phạm phải. */
    Set<String> crime;
    /** Tiền thưởng cho người cung cấp thông tin. */
    String bounty;
    /** Địa điểm xuất hiện gần nhất. */
    String lastSeen;
    /** Đường dẫn ảnh minh hoạ. */
    String imageUrl;

}
