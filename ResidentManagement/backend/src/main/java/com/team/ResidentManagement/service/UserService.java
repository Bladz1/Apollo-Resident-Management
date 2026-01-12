package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.FeedbackMapper;
import com.team.ResidentManagement.Mapper.UserMapper;
import com.team.ResidentManagement.constant.PredefinedRole;
import com.team.ResidentManagement.dto.request.UpdateUserStatusRequest;
import com.team.ResidentManagement.dto.request.UserCreationRequest;
import com.team.ResidentManagement.dto.request.UserUpdateRequest;
import com.team.ResidentManagement.dto.response.FeedbackResponse;
import com.team.ResidentManagement.dto.response.UserResponse;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.entity.Role;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.FeeRepository;
import com.team.ResidentManagement.repository.FeedbackRepository;
import com.team.ResidentManagement.repository.RoleRepository;
import com.team.ResidentManagement.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Nghiệp vụ quản lý thông tin người dùng và phân quyền.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

    /** Repository người dùng. */
    UserRepository userRepository;
    /** Mapper chuyển đổi giữa entity và DTO. */
    UserMapper userMapper;
    /** Bộ mã hoá mật khẩu chung. */
    PasswordEncoder passwordEncoder;
    /** Repository vai trò để gán quyền. */
    RoleRepository roleRepository;
    /** Repository phí để gán nghĩa vụ tài chính cho cư dân. */
    FeeRepository feeRepository;

    FileStorageService  fileStorageService;

    FeedbackRepository feedbackRepository;
    FeedbackMapper feedbackMapper;

    @NonFinal
    @Value("${file.baseUrl}")
    protected String baseUrl;

    /**
     * Tạo mới người dùng với vai trò USER mặc định.
     */
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(UserCreationRequest request) {
        return createUserInternal(request);
    }

    /**
     * Đăng ký tài khoản mới cho cư dân (không yêu cầu quyền admin).
     */
    public UserResponse registerUser(UserCreationRequest request) {
        return createUserInternal(request);
    }

    private UserResponse createUserInternal(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setStatus("PENDING");

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById(PredefinedRole.USER_ROLE).ifPresent(roles::add);

        user.setRoles(roles);

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        return userMapper.toUserResponse(user);
    }

    /**
     * Lấy thông tin người dùng đang đăng nhập dựa trên SecurityContext.
     */
    public UserResponse getMyInfo() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserResponse userResponse = userMapper.toUserResponse(user);

        HashSet<FeedbackResponse> responses = feedbackRepository.findByUserId(user.getId()).stream().map(feedbackMapper::toFeedbackResponse).collect(Collectors.toCollection(HashSet::new));

        userResponse.setFeedbacks(responses);

        return userResponse;
    }

    /**
     * Cập nhật thông tin, vai trò và các khoản phí của người dùng.
     */
    @CacheEvict(value = "users", key = "#UserId")
    public UserResponse updateUser(String UserId, UserUpdateRequest request) {
        User user = userRepository.findById(UserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        user.setRoles(new HashSet<>(roles));

        var fees = feeRepository.findAllById(request.getFees());
        user.setFees(new HashSet<>(fees));

        return userMapper.toUserResponse(userRepository.save(user));
    }
    @Cacheable(value = "users", key = "#userId")
    public UserResponse updateUserStatus(String userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus(request.isUpdate() ? "ACCEPTED" : "REJECTED");

        return userMapper.toUserResponse(userRepository.save(user));
    }

    @CacheEvict(value = "users", key = "#userId")
    @Transactional
    public User updateUserAvatar(String userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getAvatarUrl() != null) {
            String oldFilename = extractFilenameFromUrl(user.getAvatarUrl());
            fileStorageService.deleteFile(oldFilename);
        }

        String filename = fileStorageService.upload(file, userId);
        String fileUrl = baseUrl + "/api/files/" + filename;

        user.setAvatarUrl(fileUrl);
        return userRepository.save(user);
    }
    /**
     * Xoá người dùng theo ID.
     */
    @CacheEvict(value = "users", key = "#UserId")
    public String deleteUser(String UserId) {
        if (userRepository.existsById(UserId)) {
            userRepository.deleteById(UserId);
        } else throw new RuntimeException("User not found");
        return "User has been deleted!";
    }

    /**
     * Lấy danh sách toàn bộ người dùng (chỉ admin được phép).
     */
    @Cacheable(value = "users", key = "'all'")
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    /**
     * Lấy người dùng theo ID và chỉ cho phép xem nếu là chính mình.
     */
    @Cacheable(value = "users", key = "#id")
    @PostAuthorize("returnObject.username = authentication.name")
    public UserResponse getUser(String id) {

        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    private String extractFilenameFromUrl(String url) {
        return url.substring(url.lastIndexOf("/") + 1);
    }
}
