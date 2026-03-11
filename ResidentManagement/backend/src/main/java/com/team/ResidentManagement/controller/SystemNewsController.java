package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.SystemNewsRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.SystemNewsResponse;
import com.team.ResidentManagement.service.SystemNewsService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system-news")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SystemNewsController {

    SystemNewsService systemNewsService;

    @PostMapping
    public ApiResponse<SystemNewsResponse> createNews(@RequestBody SystemNewsRequest request) {
        return ApiResponse.<SystemNewsResponse>builder()
                .result(systemNewsService.createNews(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<SystemNewsResponse>> getAllNews() {
        return ApiResponse.<List<SystemNewsResponse>>builder()
                .result(systemNewsService.getAllNews())
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteNews(@PathVariable String id) {
        systemNewsService.deleteNews(id);
        return ApiResponse.builder()
                .result("Đã xóa tin tức thành công!")
                .build();
    }
}
