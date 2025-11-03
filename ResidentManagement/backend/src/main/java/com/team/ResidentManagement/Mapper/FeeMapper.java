package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.request.FeeUpdateRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.entity.Fee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface FeeMapper {
    Fee toFee(FeeRequest request);

    FeeResponse toFeeResponse(Fee fee);
}
