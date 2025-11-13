package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.WantedRequest;
import com.team.ResidentManagement.dto.response.WantedResponse;
import com.team.ResidentManagement.entity.Wanted;
import org.mapstruct.Mapper;

/**
 * Mapper chuyển đổi dữ liệu liên quan đến Wanted.
 */
@Mapper(componentModel = "spring")
public interface WantedMapper {
    /** Ánh xạ thông tin truy nã gửi lên thành entity Wanted. */
    Wanted toWanted(WantedRequest request);

    /** Chuyển entity Wanted thành DTO phản hồi chi tiết. */
    WantedResponse toWantedResponse(Wanted wanted);
}
