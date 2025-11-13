package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.FeeUpdateRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.request.FeeRequest;
import com.team.ResidentManagement.dto.response.FeeResponse;
import com.team.ResidentManagement.service.FeeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý các khoản phí: tạo, xem, cập nhật, xoá.
 */
@RestController
@RequestMapping("/fees")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeeController {

    /** Service nghiệp vụ về phí. */
    FeeService feeService;

    /** Tạo khoản phí mới. */
    @PostMapping
    ApiResponse<FeeResponse> createFee(@RequestBody FeeRequest request){
        return ApiResponse.<FeeResponse>builder()
                .result(feeService.create(request))
                .build();
    }

    /** Lấy tất cả khoản phí. */
    @GetMapping()
    ApiResponse<List<FeeResponse>> getAllFees(){
        return ApiResponse.<List<FeeResponse>>builder()
                .result(feeService.getAll())
                .build();
    }

    /** Lấy danh sách phí của một cư dân cụ thể. */
    @GetMapping("/{userId}")
    ApiResponse<List<FeeResponse>> getAllFeesFromUser(@PathVariable String userId){
        return ApiResponse.<List<FeeResponse>>builder()
                .result(feeService.getAllFromUser(userId))
                .build();
    }

    /** Cập nhật trạng thái phí (ví dụ đánh dấu đã thanh toán). */
    @PutMapping
    ApiResponse<FeeResponse> updateFee(@RequestBody FeeUpdateRequest request){
        return ApiResponse.<FeeResponse>builder()
                .result(feeService.updateFee(request))
                .build();
    }

    /** Xoá một khoản phí theo ID. */
    @DeleteMapping("/{feeId}")
    ApiResponse<Void> deleteFee(@PathVariable String feeId){
        feeService.delete(feeId);
        return ApiResponse.<Void>builder().build();
    }

    /** Xoá toàn bộ khoản phí. */
    @DeleteMapping
    ApiResponse<Void> deleteAllFees(){
        feeService.deleteAll();
        return ApiResponse.<Void>builder().build();
    }
}
