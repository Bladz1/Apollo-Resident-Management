package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.FeedbackMapper;
import com.team.ResidentManagement.dto.request.FeedbackRequest;
import com.team.ResidentManagement.dto.response.FeedbackResponse;
import com.team.ResidentManagement.entity.Feedback;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.enums.FeedbackStatus;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.FeedbackRepository;
import com.team.ResidentManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedbackService {
    UserRepository userRepository;
    FeedbackRepository feedbackRepository;
    FeedbackMapper feedbackMapper;
    FileStorageService fileStorageService;

    public void createFeedback(String userId, FeedbackRequest request) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.FEE_NOT_FOUND));

        String attachmentUrl = null;
        if (request.getFile() != null && !request.getFile().isEmpty()) {
            String filename = fileStorageService.upload(request.getFile(), userId);
            attachmentUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/files/")
                    .path(filename)
                    .toUriString();
        }

        Feedback feedback = Feedback.builder()
                .name(request.getName())
                .title(request.getTitle())
                .description(request.getDescription())
                .phone(request.getPhone())
                .address(request.getAddress())
                .email(request.getEmail())
                .status(FeedbackStatus.PENDING)
                .user(user)
                .attachmentUrl(attachmentUrl)
                .build();

        feedbackRepository.save(feedback);
    }
    public List<FeedbackResponse> getFeedbacks(String userId) {
        List<Feedback> feedbacks = feedbackRepository.findByUserId(userId);

        return feedbacks.stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    public List<FeedbackResponse> getAllFeedbacks() {
        return feedbackRepository.findAll().stream()
                .map(feedbackMapper::toFeedbackResponse)
                .toList();
    }

    public FeedbackResponse updateFeedbackStatus(String id, FeedbackStatus status) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_FOUND));
        feedback.setStatus(status);
        feedbackRepository.save(feedback);
        return feedbackMapper.toFeedbackResponse(feedback);
    }
    public void deleteFeedback(String id){
        feedbackRepository.deleteById(id);
    }

}
