package com.team.ResidentManagement.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

/**
 * Danh sách mã lỗi chuẩn hoá cùng thông điệp và HTTP status tương ứng.
 * Sử dụng để đồng bộ phản hồi lỗi giữa backend và frontend.
 */
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(999, "Uncategorized Error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized Error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User already exist", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003, "User Not Found", HttpStatus.NOT_FOUND),
    USERNAME_INVALID(1004, "Username must be at least 3 characters!", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1005, "Password must be at least 8 characters!", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_EXCEPTION(1006, "Unauthorized Error", HttpStatus.FORBIDDEN),
    UNAUTHENTICATED(1007, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    INVALID_BIRTHDAY(1008, "You age must be at least {min}", HttpStatus.BAD_REQUEST),
    FEE_NOT_FOUND(1009, "Fee Not Found", HttpStatus.NOT_FOUND),
    FEE_NOT_BELONG_TO_USER(1010, "Fee not being to User", HttpStatus.FORBIDDEN),
    WANTED_NOT_FOUND(1011, "Wanted Not Found", HttpStatus.NOT_FOUND),
    PROFILE_NOT_FOUND(1012, "Profile Not Found", HttpStatus.NOT_FOUND),
    PROFILE_EXISTED(1013, "Profile Existed", HttpStatus.BAD_REQUEST),
    FILE_IS_EMPTY(1014, "File is empty", HttpStatus.BAD_REQUEST),
    ONLY_FILE_ALLOW(1015, "Only File Allowed ", HttpStatus.BAD_REQUEST),
    UPLOAD_FAILED(1016, "Upload Failed", HttpStatus.INTERNAL_SERVER_ERROR),
    FEEDBACK_NOT_FOUND(1017, "Feedback Not Found", HttpStatus.NOT_FOUND),
    USER_NOT_ACCEPT(1018, "User Not Accepted", HttpStatus.FORBIDDEN),
    ;

    /** Mã số lỗi nội bộ phục vụ phân loại. */
    private int code;
    /** Thông điệp mô tả lỗi hiển thị cho người dùng. */
    private String message;
    /** Mã trạng thái HTTP trả về cho client. */
    private HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
