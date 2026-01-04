package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.FeedbackMapper;
import com.team.ResidentManagement.dto.request.FeedbackRequest;
import com.team.ResidentManagement.dto.response.FeedbackResponse;
import com.team.ResidentManagement.entity.Feedback;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.FeedbackRepository;
import com.team.ResidentManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {
    UserRepository userRepository;
    FeedbackRepository feedbackRepository;
    FileStorageService fileStorageService;
    FeedbackMapper feedbackMapper;

    public void createFeedback(String userId, FeedbackRequest request) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.FEE_NOT_FOUND));

        Feedback feedback = Feedback.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .phone(request.getPhone())
                .address(request.getAddress())
                .email(request.getEmail())
                .user(user)
                .build();

        MultipartFile file = request.getFile();
        if (file != null &&  !file.isEmpty()) {
            String url = fileStorageService.upload(file, userId);
            feedback.setAttachmentUrl(url);
        }

        feedbackRepository.save(feedback);
    }
    public List<FeedbackResponse> getFeedbacks(String userId) {
        List<Feedback> feedbacks = feedbackRepository.findByUserId(userId);

        return feedbacks.stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }
    public void deleteFeedback(String id){
        feedbackRepository.deleteById(id);
    }

}
