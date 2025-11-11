package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.WantedCrimePatchRequest;
import com.team.ResidentManagement.dto.request.WantedRequest;
import com.team.ResidentManagement.dto.request.WantedUpdateRequest;
import com.team.ResidentManagement.dto.response.WantedResponse;
import com.team.ResidentManagement.entity.Wanted;
import com.team.ResidentManagement.service.WantedService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý hồ sơ truy nã và danh sách tội danh liên quan.
 */
@RestController
@RequestMapping("/wanted")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j

public class WantedController {

    /** Service nghiệp vụ truy nã. */
    WantedService wantedService;

    /** Tạo hồ sơ truy nã mới. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WantedResponse create(@RequestBody WantedRequest wantedRequest) {
        return wantedService.create(wantedRequest);
    }

    /** Lấy tất cả hồ sơ truy nã. */
    @GetMapping
    public List<WantedResponse> getAll() {
        return wantedService.getAll();
    }

    /** Xem chi tiết hồ sơ theo ID. */
    @GetMapping("/{id}")
    public WantedResponse getById(@PathVariable String id) {
        return wantedService.getWantedByWantedId(id);
    }

    /** Xoá hồ sơ truy nã theo ID. */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        wantedService.deleteWantedById(id);
    }

    /** Xoá toàn bộ hồ sơ truy nã. */
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAll() {
        wantedService.deleteAll();
    }

    /** Cập nhật thông tin cơ bản của hồ sơ truy nã. */
    @PatchMapping("/{id}")
    public WantedResponse patchWanted(@PathVariable String id, @RequestBody WantedUpdateRequest wantedUpdateRequest) {
        return wantedService.updateWanted(id, wantedUpdateRequest);
    }

    /** Cập nhật danh sách tội danh cho hồ sơ truy nã. */
    @PatchMapping("/{id}/crimes")
    public WantedResponse patchWanted(@PathVariable String id, @RequestBody WantedCrimePatchRequest  wantedCrimePatchRequest) {
        return wantedService.patchCrimes(id, wantedCrimePatchRequest);
    }

}
