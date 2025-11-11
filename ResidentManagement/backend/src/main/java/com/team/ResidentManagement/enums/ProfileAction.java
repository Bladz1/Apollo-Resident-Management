package com.team.ResidentManagement.enums;

public enum ProfileAction {
    SUBMITTED("Gửi hồ sơ"),
    ASSIGNED("Phân công xử lý"),
    PROCESSING("Bắt đầu xử lý"),
    APPROVED("Phê duyệt"),
    REJECTED("Từ chối"),
    CANCELLED("Hủy bỏ"),
    RETURNED("Trả lại yêu cầu bổ sung"),
    UPDATED("Cập nhật thông tin"),
    COMMENTED("Thêm ghi chú"),
    ESCALATED("Chuyển cấp trên"),
    COMPLETED("Hoàn thành");

    private final String description;

    ProfileAction(String description){
        this.description = description;
    }

    public String getDescription(){
        return this.description;
    }
}
