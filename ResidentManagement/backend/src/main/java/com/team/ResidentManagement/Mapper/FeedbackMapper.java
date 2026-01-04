package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.FeedbackRequest;
import com.team.ResidentManagement.dto.response.FeedbackResponse;
import com.team.ResidentManagement.entity.Feedback;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {
    @Mapping(target = "attachmentUrl", ignore = true)
    Feedback toFeedback(FeedbackRequest request);

    FeedbackResponse toFeedbackResponse(Feedback feedback);
}
