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

        Boolean existsImmediately = redisTemplate.hasKey(key);
        String value = redisTemplate.opsForValue().get(key);
        System.out.println("DEBUG - After set:");
        System.out.println("  Key: " + key);
        System.out.println("  Exists: " + existsImmediately);
        System.out.println("  Value: " + value);
        System.out.println("  TTL: " + redisTemplate.getExpire(key));
    }

    public OnlineResponse isOnline(String userId) {
        String key = "online:" + userId;
        Boolean exists = redisTemplate.hasKey(key);
        String value = redisTemplate.opsForValue().get(key);

        System.out.println("DEBUG - When checking:");
        System.out.println("  Key: " + key);
        System.out.println("  Exists: " + exists);
        System.out.println("  Value: " + value);

        return OnlineResponse.builder()
                .online(exists)
                .build();
    }
}
