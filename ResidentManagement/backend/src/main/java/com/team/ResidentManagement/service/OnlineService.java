package com.team.ResidentManagement.service;

import com.team.ResidentManagement.dto.request.OnlineRequest;
import com.team.ResidentManagement.dto.response.OnlineResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OnlineService {

    RedisTemplate<String, String> redisTemplate;

    private static final Duration ONLINE_TTL = Duration.ofSeconds(60);

    public void updateOnlineStatus(OnlineRequest request) {
        String key = "online:" + request.getUserId();
        redisTemplate.opsForValue().set(key, "1", ONLINE_TTL);
    }

    public OnlineResponse isOnline(String userId) {
        return OnlineResponse.builder()
                .online(redisTemplate.hasKey("online:" + userId))
                .build();
    }
}
