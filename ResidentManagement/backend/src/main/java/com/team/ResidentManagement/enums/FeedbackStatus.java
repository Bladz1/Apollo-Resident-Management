package com.team.ResidentManagement.enums;

import lombok.Getter;

@Getter
public enum FeedbackStatus {
    PENDING("Chờ xử lý"),
    ACCEPTED("Đã tiếp nhận"),
    REJECTED("Đã từ chối");

    private final String label;

    FeedbackStatus(String label) {
        this.label = label;
    }
}
