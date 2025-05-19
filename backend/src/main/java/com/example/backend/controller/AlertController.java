package com.example.backend.controller;

import com.example.backend.dto.AlertRequestDTO;
import com.example.backend.dto.AlertResponseDTO;
import com.example.backend.dto.AlertStatsDTO;
import com.example.backend.entity.Alert;
import com.example.backend.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertService alertService;

    @Autowired
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @PostMapping
    public ResponseEntity<Alert> createAlert(@RequestBody AlertRequestDTO requestDTO) {
        Alert alert = alertService.createAlert(requestDTO);
        return new ResponseEntity<>(alert, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
        Alert alert = alertService.getAlertById(id);
        return new ResponseEntity<>(alert, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllAlerts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String type) {

        Page<Alert> alertsPage = alertService.getAllAlerts(page, limit, sort);

        List<Alert> alerts = alertsPage.getContent();

        Map<String, Object> response = new HashMap<>();
        response.put("data", alerts);

        Map<String, Object> meta = new HashMap<>();
        meta.put("page", page);
        meta.put("limit", limit);
        meta.put("total", alertsPage.getTotalElements());
        meta.put("pages", alertsPage.getTotalPages());

        response.put("meta", meta);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getAlertsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort) {

        Page<Alert> alertsPage = alertService.getAlertsByUserId(userId, page, limit, sort);

        List<Alert> alerts = alertsPage.getContent();

        Map<String, Object> response = new HashMap<>();
        response.put("data", alerts);

        Map<String, Object> meta = new HashMap<>();
        meta.put("page", page);
        meta.put("limit", limit);
        meta.put("total", alertsPage.getTotalElements());
        meta.put("pages", alertsPage.getTotalPages());

        response.put("meta", meta);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<Map<String, Object>> getAlertsByVehicleId(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort) {

        Page<Alert> alertsPage = alertService.getAlertsByVehicleId(vehicleId, page, limit, sort);

        List<Alert> alerts = alertsPage.getContent();

        Map<String, Object> response = new HashMap<>();
        response.put("data", alerts);

        Map<String, Object> meta = new HashMap<>();
        meta.put("page", page);
        meta.put("limit", limit);
        meta.put("total", alertsPage.getTotalElements());
        meta.put("pages", alertsPage.getTotalPages());

        response.put("meta", meta);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> updateAlert(
            @PathVariable Long id,
            @RequestBody AlertRequestDTO requestDTO) {

        Alert alert = alertService.updateAlert(id, requestDTO);
        return new ResponseEntity<>(alert, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAlertStats(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long vehicleId) {

        AlertStatsDTO stats = alertService.getAlertStats(userId, vehicleId);

        Map<String, Object> response = new HashMap<>();
        response.put("data", stats);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


}