package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.entity.Fee;
import org.mapstruct.Mapper;

/**
 * Mapper chuyển đổi dữ liệu liên quan đến Fee.
 */
@Mapper(componentModel = "spring")
public interface FeeMapper {
    /** Ánh xạ thông tin tạo khoản phí thành entity Fee. */
    Fee toFee(FeeRequest request);

    /** Chuyển entity Fee thành DTO phản hồi. */
    FeeResponse toFeeResponse(Fee fee);
}
