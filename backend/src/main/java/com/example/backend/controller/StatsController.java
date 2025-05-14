package com.example.backend.controller;

import com.example.backend.dto.DashboardDataDTO;
import com.example.backend.dto.StatsSummaryDTO;
import com.example.backend.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    private final StatsService statsService;

    @Autowired
    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<StatsSummaryDTO> getStatsSummary() {
        StatsSummaryDTO summary = statsService.getStatsSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/devices")
    public ResponseEntity<List<String>> getDeviceList() {
        List<String> devices = statsService.getAllDeviceIds();
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDataDTO> getDashboardData() {
        DashboardDataDTO dashboardData = statsService.getDashboardData();
        return ResponseEntity.ok(dashboardData);
    }
}