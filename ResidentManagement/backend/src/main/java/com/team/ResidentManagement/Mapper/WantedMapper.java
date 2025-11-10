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
    Wanted toWanted(WantedRequest request);

    WantedResponse toWantedResponse(Wanted wanted);
}
