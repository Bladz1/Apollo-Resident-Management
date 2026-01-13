package com.team.ResidentManagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

/**
 * Thực thể thể hiện khoản phí/hoá đơn mà cư dân cần thanh toán.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Fee {

    /** Mã định danh phí dạng UUID. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    /** Loại phí (tham chiếu enum Bill). */
    String feeType;

    /** Mã danh mục nếu cần liên kết với bảng khác. */
    String categoryId;
    /** Tên hiển thị của khoản phí. */
    String name;
    /** Đơn vị thu phí. */
    String agency;
    /** Số tiền phải đóng. */
    int amount;
    /** Hạn chót thanh toán. */
    LocalDate dueDate;
    /** Trạng thái thanh toán hiện tại. */
    String status;
    /** Ghi chú chi tiết. */
    String description;
}
