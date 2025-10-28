package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.ApiResponse;
import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.service.FeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/fees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeeController {
    FeeService feeService;

    @PostMapping
    ApiResponse<FeeResponse> createFee(@RequestBody FeeRequest request){
        log.info("Hello");
        return ApiResponse.<FeeResponse>builder()
                .result(feeService.create(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<FeeResponse>> getAllFees(){
        return ApiResponse.<List<FeeResponse>>builder()
                .result(feeService.getAll())
                .build();
    }

    @DeleteMapping("/{fee}")
    ApiResponse<Void> deleteFee(@PathVariable String fee){
        feeService.delete(fee);
        return ApiResponse.<Void>builder().build();
    }
}
