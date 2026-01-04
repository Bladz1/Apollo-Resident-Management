package com.team.ResidentManagement.enums;

import lombok.Getter;

@Getter
public enum ProfileType {
    RESIDENCE_REGISTRATION("DK_THUONG_TRU", "Đăng ký thường trú"),
    TEMPORARY_REGISTRATION("DK_TAM_TRU", "Đăng ký tạm trú"),
    INFORMATION_UPDATE("CNTT", "Cập nhật thông tin"),
    TEMPORARY_ABSENCE("KBTV", "Khai báo tạm vắng"),
    PERMANENT_ABSENCE("KBCD", "Khai báo chuyển đi"),
    HOUSEHOLD_REGISTRATION("DKHK", "Đăng ký hộ khẩu"),
    HOUSEHOLD_SPLIT("THK", "Tách hộ khẩu"),
    BIRTH_REGISTRATION("KS", "Khai sinh"),
    DEATH_REGISTRATION("KT", "Khai tử"),
    OTHER("K", "Khác");

    private final String code;
    private final String type;

    ProfileType(String code, String type){
        this.code = code;
        this.type = type;
    }

    public static String fromCode(String code){
        for (ProfileType type : values()){
            if (type.code.equals(code)){
                return type.code;
            }
        }
        throw new IllegalArgumentException("Unknown profile type: " + code);
    }
}
