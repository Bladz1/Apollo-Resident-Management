package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.entity.Fee;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeeMapper {
    Fee toFee(FeeRequest request);

    FeeResponse toFeeResponse(Fee fee);
}
