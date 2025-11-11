package com.team.ResidentManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ứng dụng Spring Boot chính khởi động hệ thống Quản lý Cư dân.
 * Đây là điểm vào duy nhất để nạp toàn bộ cấu hình và các bean.
 */
@SpringBootApplication
public class ResidentManagementApplication {

    /**
     * Hàm main chuẩn để chạy ứng dụng bằng SpringApplication.
     * @param args tham số dòng lệnh (nếu có) truyền từ môi trường chạy.
     */
    public static void main(String[] args) {
        SpringApplication.run(ResidentManagementApplication.class, args);
    }
}
