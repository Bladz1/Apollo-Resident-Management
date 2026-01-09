package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.UserCreationRequest;
import com.team.ResidentManagement.dto.response.UserResponse;
import com.team.ResidentManagement.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;

@Slf4j
@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private UserCreationRequest request;
    private UserResponse userResponse;
    private LocalDate date;

    @BeforeEach
    void initData() {
        date = LocalDate.of(2020, 1, 1);

        request = UserCreationRequest.builder()
                .username("John")
                .password("22222222q")
                .email("john.smith@example.com")
                .gender("MALE")
                .birthday(date)
                .build();

        userResponse = UserResponse.builder()
                .id("123456789")
                .username("John")
                .email("john.smith@example.com")
                .gender("MALE")
                .birthday(date)
                .build();
    }

    @Test
    //
    void createUser_validRequest_success() throws Exception {
        // GIVEN
        ObjectMapper mapper = new ObjectMapper();
        String content = mapper.writeValueAsString(request);

        Mockito.when(userService.createUser(ArgumentMatchers.any())).thenReturn(userResponse);

        // WHEN
        mockMvc.perform(MockMvcRequestBuilders
                .post("/users")
                .content(content)
                .contentType(MediaType.APPLICATION_JSON_VALUE))

                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("code").value(1000));

    }

}
