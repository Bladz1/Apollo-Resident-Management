package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.WantedRequest;
import com.team.ResidentManagement.dto.response.WantedResponse;
import com.team.ResidentManagement.entity.Wanted;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface WantedMapper {
    Wanted toWanted(WantedRequest request);

    WantedResponse toWantedResponse(Wanted wanted);
}
