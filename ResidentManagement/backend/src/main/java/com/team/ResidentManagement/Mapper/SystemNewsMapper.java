package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.SystemNewsRequest;
import com.team.ResidentManagement.dto.response.SystemNewsResponse;
import com.team.ResidentManagement.entity.SystemNews;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SystemNewsMapper {
    SystemNews toSystemNews(SystemNewsRequest request);

    SystemNewsResponse toSystemNewsResponse(SystemNews entity);
}
