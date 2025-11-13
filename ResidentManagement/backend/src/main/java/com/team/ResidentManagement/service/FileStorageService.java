package com.team.ResidentManagement.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.Resource;
import java.nio.file.Path;
import java.nio.file.Paths;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

/**
 * Dịch vụ lưu trữ file trên hệ thống (avatar, tài liệu kèm theo hồ sơ, ...).
 * <p>
 * Hỗ trợ lưu, tải và xoá file từ thư mục cấu hình trong application properties.
 * </p>
 */
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FileStorageService {

    /** Đường dẫn thư mục lưu trữ file được cấu hình qua properties. */
    @NonFinal
    @Value("${file.uploadDir}")
    protected String uploadDir;

    /**
     * Lưu file do người dùng upload vào thư mục lưu trữ.
     * <p>
     * Thư mục được tạo nếu chưa tồn tại, tên file được chuẩn hoá đảm bảo tính duy nhất.
     * </p>
     */
    public String storeFile(MultipartFile file, String userId) throws IOException {
        // Tạo thư mục lưu trữ nếu chưa tồn tại.
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Sinh tên file duy nhất dựa trên userId và thời gian hiện tại.
        String filename = generateFileName(file.getOriginalFilename(), userId);
        Path filePath = uploadPath.resolve(filename);

        // Sao chép dữ liệu vào đích, ghi đè nếu đã tồn tại.
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    /**
     * Tải file trong thư mục lưu trữ thành {@link Resource} để trả về cho client.
     */
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found or not readable: " + filename);
            }
        } catch (Exception e) {
            throw new RuntimeException("File not found: " + filename, e);
        }
    }

    /**
     * Xoá file đã lưu nếu tồn tại.
     */
    public void deleteFile(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Files.deleteIfExists(filePath);
    }

    /**
     * Tạo tên file chuẩn hoá với tiền tố avatar theo userId.
     */
    private String generateFileName(String originalFileName, String userId) {
        String extension = getFileExtension(originalFileName);
        return "avatar-" + userId + "-" + System.currentTimeMillis() + extension;
    }

    /**
     * Lấy phần đuôi mở rộng của tên file.
     */
    private String getFileExtension(String filename) {
        return filename != null && filename.contains(".")
                ? filename.substring(filename.lastIndexOf("."))
                : "";
    }
}
