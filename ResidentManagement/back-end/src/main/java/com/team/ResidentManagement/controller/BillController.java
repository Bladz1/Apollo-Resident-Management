package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.ApiResponse;
import com.team.ResidentManagement.dto.request.BillRequest;
import com.team.ResidentManagement.dto.response.BillResponse;
import com.team.ResidentManagement.service.BillService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bills")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BillController {
    private final BillService billService;

    @PostMapping
    ApiResponse<BillResponse> createBill(@RequestBody BillRequest request){
        return ApiResponse.<BillResponse>builder()
                .result(billService.createBill(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<BillResponse>> getBills(){
        return ApiResponse.<List<BillResponse>>builder()
                .result(billService.getAllBills())
                .build();
    }


}
