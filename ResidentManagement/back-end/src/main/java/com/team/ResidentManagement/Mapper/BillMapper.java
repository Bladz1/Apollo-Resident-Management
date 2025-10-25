package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.BillRequest;
import com.team.ResidentManagement.dto.response.BillResponse;
import com.team.ResidentManagement.entity.Bill;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BillMapper {
    @Mapping(target = "fees", ignore = true)
    Bill toBill(BillRequest request);

    BillResponse toBillResponse(Bill bill);
}
