package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.service.FileStorageService;
import com.team.ResidentManagement.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Controller xử lý upload và phục vụ file tĩnh (avatar người dùng).
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FileUploadController {

    /** Dịch vụ lưu trữ file. */
    FileStorageService fileStorageService;

    /** Dịch vụ người dùng để cập nhật avatar. */
    UserService userService;

    /**
     * Upload avatar mới cho người dùng, đồng thời cập nhật URL trong hồ sơ.
     */
    @PostMapping("/upload-avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestHeader("UserId") String userId) {

        try {
            // Kiểm tra file có dữ liệu không.
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            // Chỉ chấp nhận định dạng ảnh để đảm bảo tính toàn vẹn avatar.
            if (!isImageFile(file)) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            // Cập nhật avatar người dùng và lấy lại thông tin mới nhất.
            User updatedUser = userService.updateUserAvatar(userId, file);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Avatar uploaded successfully");
            response.put("avatarUrl", updatedUser.getAvatarUrl());
            response.put("user", updatedUser);

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    /**
     * Trả file tĩnh theo tên để frontend hiển thị avatar.
     */
    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Resource file = fileStorageService.loadFileAsResource(filename);

            String contentType = determineContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + file.getFilename() + "\"")
                    .body(file);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /** Kiểm tra content-type của file có phải ảnh không. */
    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    /** Xác định content-type dựa trên đuôi file để trình duyệt hiển thị đúng. */
    private String determineContentType(String filename) {
        try {
            Path path = Paths.get(filename);
            String mimeType = Files.probeContentType(path);
            return mimeType != null ? mimeType : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}