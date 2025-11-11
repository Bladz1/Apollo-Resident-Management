package com.team.ResidentManagement.enums;


import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;

public enum ProfileType {
    RESIDENCE_REGISTRATION("DK_THUONG_TRU", "Đăng ký thường trú"),
    TEMPORARY_REGISTRATION("DK_TAM_TRU", "Đăng ký tạm trú"),
    INFORMATION_UPDATE("CAP_NHAT_TT", "Cập nhật thông tin"),
    TEMPORARY_ABSENCE("KB_TAM_VANG", "Khai báo tạm vắng"),
    PERMANENT_ABSENCE("KB_CHUYEN_DI", "Khai báo chuyển đi"),
    HOUSEHOLD_REGISTRATION("DK_HO_KHAU", "Đăng ký hộ khẩu"),
    HOUSEHOLD_SPLIT("TACH_HO_KHAU", "Tách hộ khẩu"),
    BIRTH_REGISTRATION("KHAI_SINH", "Khai sinh"),
    DEATH_REGISTRATION("KHAI_TU", "Khai tử"),
    OTHER("K", "Khác");

    private final String code;
    private final String type;

    ProfileType(String code, String type){
        this.code = code;
        this.type = type;
    }

    public static ProfileType fromCode(String code){
        for (ProfileType type : values()){
            if (type.code.equals(code)){
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown profile type: " + code);
    }

    public String getType(){
        return this.type;
    }
    public String getCode(){
        return this.code;
    }
}
