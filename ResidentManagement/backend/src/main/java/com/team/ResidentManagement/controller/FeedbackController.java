package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.Mapper.FeedbackMapper;
import com.team.ResidentManagement.dto.request.FeedbackRequest;
import com.team.ResidentManagement.dto.request.FeedbackStatusRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.FeedbackResponse;
import com.team.ResidentManagement.service.FeedbackService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/feedbacks")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FeedbackController {

    FeedbackService feedBackService;

    @GetMapping("/{userId}")
    public ApiResponse<List<FeedbackResponse>> getFeedbacks(@PathVariable String userId) {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedBackService.getFeedbacks(userId))
                .build();
    }

    @GetMapping
    public ApiResponse<List<FeedbackResponse>> getAllFeedbacks() {
        return ApiResponse.<List<FeedbackResponse>>builder()
                .result(feedBackService.getAllFeedbacks())
                .build();
    }

    @PostMapping("/{userId}")
    public ApiResponse<Object> uploadFeedback(@PathVariable String userId, @RequestParam String name,
                                              @RequestParam String email,
                                              @RequestParam String phone,
                                              @RequestParam String address,
                                              @RequestParam String title,
                                              @RequestParam String description,
                                              @RequestParam(required = false) MultipartFile file) throws IOException {
        FeedbackRequest feedbackRequest = FeedbackRequest.builder()
                        .name(name)
                                .email(email)
                                        .phone(phone)
                                                .address(address)
                                                        .title(title)
                                                                .description(description)
                .file(file).build();

        feedBackService.createFeedback(userId, feedbackRequest);

        return ApiResponse.builder()
                .result("Thank you for your feed back!")
                .build();
    }

    @PutMapping("/{id}/status")
    public ApiResponse<FeedbackResponse> updateFeedbackStatus(
            @PathVariable String id,
            @RequestBody FeedbackStatusRequest request
    ) {
        return ApiResponse.<FeedbackResponse>builder()
                .result(feedBackService.updateFeedbackStatus(id, request.getStatus()))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteFeedback(@PathVariable String id) {

        feedBackService.deleteFeedback(id);

        return ApiResponse.builder()
                .result("Successfully deleted feedback!")
                .code(123)
                .build();
    }
}
