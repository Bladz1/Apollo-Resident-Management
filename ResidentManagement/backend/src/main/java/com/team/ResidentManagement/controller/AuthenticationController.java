package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.*;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.AuthenticationResponse;
import com.team.ResidentManagement.dto.response.IntrospectResponse;
import com.team.ResidentManagement.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

/**
 * Cung cấp API xác thực JWT (đăng nhập, introspect, refresh, logout).
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationController {

    /** Dịch vụ xử lý xác thực. */
    AuthenticationService authenticationService;

    /**
     * Endpoint đăng nhập, trả về token.
     */
    @PostMapping("/token")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request){
        var result = authenticationService.authenticate(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    /**
     * Endpoint kiểm tra token còn hợp lệ hay không.
     */
    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    /**
     * Endpoint làm mới token.
     */
    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        var result = authenticationService.refreshToken(request);

        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    /**
     * Endpoint đăng xuất và vô hiệu hoá token.
     */
    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);

        return ApiResponse.<Void>builder().build();
    }
}
