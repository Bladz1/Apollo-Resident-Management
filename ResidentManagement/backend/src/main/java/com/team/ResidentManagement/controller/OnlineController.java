package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.OnlineRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.OnlineResponse;
import com.team.ResidentManagement.service.OnlineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/online")
@RequiredArgsConstructor
public class OnlineController {

    private final OnlineService onlineService;

    // 🔵 Client heartbeat every 30 seconds
    @PostMapping("/ping")
    public void ping(@RequestBody OnlineRequest request) {
        onlineService.updateOnlineStatus(request);
    }

    // 🟢 Check if user is online
    @GetMapping("/{userId}")
    public ApiResponse<OnlineResponse> isOnline(@PathVariable String userId) {
        return ApiResponse.<OnlineResponse>builder()
                .result(onlineService.isOnline(userId))
                .build();
    }
}
