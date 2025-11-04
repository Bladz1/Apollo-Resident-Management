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

@RestController
@RequestMapping("/wanted")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j

public class WantedController {
    WantedService wantedService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WantedResponse create(@RequestBody WantedRequest wantedRequest) {
        return wantedService.create(wantedRequest);
    }

    @GetMapping
    public List<WantedResponse> getAll() {
        return wantedService.getAll();
    }

    @GetMapping("/{id}")
    public WantedResponse getById(@PathVariable String id) {
        return wantedService.getWantedByWantedId(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        wantedService.deleteWantedById(id);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAll() {
        wantedService.deleteAll();
    }

    @PatchMapping("/{id}")
    public WantedResponse patchWanted(@PathVariable String id, @RequestBody WantedUpdateRequest wantedUpdateRequest) {
        return wantedService.updateWanted(id, wantedUpdateRequest);
    }

    @PatchMapping("/{id}/crimes")
    public WantedResponse patchWanted(@PathVariable String id, @RequestBody WantedCrimePatchRequest  wantedCrimePatchRequest) {
        return wantedService.patchCrimes(id, wantedCrimePatchRequest);
    }

}
