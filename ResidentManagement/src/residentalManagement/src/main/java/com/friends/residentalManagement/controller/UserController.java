package com.friends.residentalManagement.controller;

import com.friends.residentalManagement.dto.response.ApiResponse;
import com.friends.residentalManagement.dto.request.CreateUserRequest;
import com.friends.residentalManagement.dto.response.UserResponse;
import com.friends.residentalManagement.entity.User;
import com.friends.residentalManagement.service.UserService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@Controller
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping()
    public List<User> getAllUsers(){
        return userService.getUsers();
    }

    @GetMapping("/{userId}")
    public UserResponse getUserById(@PathVariable String userId){

        return userService.getUser(userId);
    }

    @PostMapping()
    public ApiResponse<User> createUsers(@RequestBody CreateUserRequest request){
        ApiResponse<User> response = new ApiResponse<>();

        response.setResult(userService.createrUser(request));

        return response;
    }
}
