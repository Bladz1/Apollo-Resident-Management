package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.SystemNewsMapper;
import com.team.ResidentManagement.dto.request.SystemNewsRequest;
import com.team.ResidentManagement.dto.response.SystemNewsResponse;
import com.team.ResidentManagement.entity.SystemNews;
import com.team.ResidentManagement.repository.SystemNewsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SystemNewsService {
    SystemNewsRepository systemNewsRepository;
    SystemNewsMapper systemNewsMapper;

    public SystemNewsResponse createNews(SystemNewsRequest request) {
        SystemNews news = systemNewsMapper.toSystemNews(request);
        SystemNews saved = systemNewsRepository.save(news);
        return systemNewsMapper.toSystemNewsResponse(saved);
    }

    public List<SystemNewsResponse> getAllNews() {
        return systemNewsRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(systemNewsMapper::toSystemNewsResponse)
                .toList();
    }

    public void deleteNews(String id) {
        systemNewsRepository.deleteById(id);
    }
}
