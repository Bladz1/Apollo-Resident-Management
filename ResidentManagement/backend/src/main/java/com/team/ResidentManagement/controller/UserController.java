package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.UpdateUserStatusRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.PendingUserResponse;
import com.team.ResidentManagement.dto.request.UserCreationRequest;
import com.team.ResidentManagement.dto.request.UserUpdateRequest;
import com.team.ResidentManagement.dto.response.UserResponse;
import com.team.ResidentManagement.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý người dùng: tạo, cập nhật, xem thông tin.
 */
@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    /** Service nghiệp vụ người dùng. */
    UserService userService;

    /**
     * Tạo mới tài khoản cư dân.
     */
    @PostMapping()
    public ApiResponse<UserResponse> createUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.createUser(request))
                .build();
    }
    @PutMapping("/status/{userId}")
    public ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UpdateUserStatusRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUserStatus(userId,request))
                .build();
    }

    /**
     * Đăng ký tài khoản mới cho cư dân.
     */
    @PostMapping("/register")
    public ApiResponse<UserResponse> registerUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.registerUser(request))
                .build();
    }

    /**
     * Lấy danh sách toàn bộ người dùng.
     */
    @GetMapping()
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    /**
     * Lấy chi tiết một người dùng theo ID.
     */
    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUserById(@PathVariable("userId") String userId){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }
    @GetMapping("/pending")
    ApiResponse<List<PendingUserResponse>> getPendingUser(){
        return ApiResponse.<List<PendingUserResponse>>builder()
                .result(userService.getPendingUsers())
                .build();
    }

    /**
     * Lấy thông tin của chính người dùng đang đăng nhập.
     */
    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo(){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    /**
     * Cập nhật thông tin cư dân theo ID.
     */
    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    /**
     * Xoá người dùng khỏi hệ thống.
     */
    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable("userId") String userId) {
        return userService.deleteUser(userId);
    }
}
