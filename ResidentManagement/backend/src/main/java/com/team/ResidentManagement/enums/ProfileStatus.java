package com.team.ResidentManagement.enums;

import lombok.Getter;

@Getter
public enum ProfileStatus {
    PENDING("Chờ xử lý"),
    PROCESSING("Đang xử lý"),
    APPROVED("Đã duyệt"),
    REJECTED("Đã từ chối"),
    CANCELLED("Đã hủy"),
    NEED_MORE_INFO("Cần bổ sung thông tin");

    private final String status;

    ProfileStatus(String status){
        this.status = status;
    }
}
