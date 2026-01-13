package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.UpdateUserStatusRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
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

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

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

    @PostMapping("/register")
    public ApiResponse<UserResponse> registerUser(@RequestBody @Valid UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.registerUser(request))
                .build();
    }

    @GetMapping()
    public ApiResponse<List<UserResponse>> getAllUsers() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    ApiResponse<UserResponse> getUserById(@PathVariable("userId") String userId){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(userId))
                .build();
    }
    @GetMapping("/pending")
    ApiResponse<List<UserResponse>> getPendingUser(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getPendingUsers())
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserResponse> getMyInfo(){
        return ApiResponse.<UserResponse>builder()
                .result(userService.getMyInfo())
                .build();
    }

    @PutMapping("/{userId}")
    ApiResponse<UserResponse> updateUser(@PathVariable String userId, @RequestBody UserUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.updateUser(userId, request))
                .build();
    }

    @DeleteMapping("/{userId}")
    public String deleteUser(@PathVariable("userId") String userId) {
        return userService.deleteUser(userId);
    }
}
