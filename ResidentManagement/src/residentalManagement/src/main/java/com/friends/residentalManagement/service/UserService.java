package com.friends.residentalManagement.service;

import com.friends.residentalManagement.dto.request.CreateUserRequest;
import com.friends.residentalManagement.dto.response.UserResponse;
import com.friends.residentalManagement.entity.User;
import com.friends.residentalManagement.mapper.UserMapper;
import com.friends.residentalManagement.repository.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    public UserResponse getUser(String userId) {

        return userMapper.toUserResponse(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    public User createrUser(CreateUserRequest request){

        User user = userMapper.toUser(request);

        return userRepository.save(user);
    }
}
