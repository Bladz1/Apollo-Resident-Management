package com.team.ResidentManagement.exception;

/**
 * Ngoại lệ tuỳ biến cho ứng dụng, giúp đóng gói {@link ErrorCode} kèm theo thông điệp chuẩn hoá.
 */
public class AppException extends RuntimeException {

    /**
     * Mã lỗi mô tả tình trạng nghiệp vụ gặp phải.
     */
    private ErrorCode errorCode;

    /**
     * Khởi tạo ngoại lệ dựa trên mã lỗi và tự động truyền thông điệp cho RuntimeException.
     * @param errorCode mã lỗi nghiệp vụ cần trả về cho client.
     */
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    /**
     * Lấy mã lỗi đi kèm ngoại lệ.
     */
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * Cập nhật mã lỗi trong ngoại lệ nhằm tuỳ biến phản hồi khi cần.
     */
    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
