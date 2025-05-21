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
    public ResponseEntity<AlertResponseDTO> getAlertById(@PathVariable Long id) {
        Alert alert = alertService.getAlertById(id);

        // Convertir Alert en AlertResponseDTO
        AlertResponseDTO responseDTO = new AlertResponseDTO();
        responseDTO.setId(alert.getId());
        responseDTO.setType(alert.getType());
        responseDTO.setDescription(alert.getDescription());
        responseDTO.setSeverity(alert.getSeverity());
        responseDTO.setStatus(alert.getStatus());
        responseDTO.setTimestamp(alert.getTimestamp());
        responseDTO.setNotes(alert.getNotes());
        responseDTO.setData(alert.getData());

        // Ajouter l'ID du véhicule directement dans la réponse
        if (alert.getVehicle() != null) {
            responseDTO.setVehicleId(alert.getVehicle().getId());

            // Vous pouvez aussi continuer à inclure les informations détaillées du véhicule
            AlertResponseDTO.VehicleDTO vehicleDTO = new AlertResponseDTO.VehicleDTO();
            vehicleDTO.setId(alert.getVehicle().getId());
            vehicleDTO.setBrand(alert.getVehicle().getBrand());
            vehicleDTO.setModel(alert.getVehicle().getModel());
            vehicleDTO.setLicensePlate(alert.getVehicle().getLicensePlate());
            responseDTO.setCar(vehicleDTO);
        }

        // Ajouter location si disponible
        if (alert.getLocation() != null) {
            AlertResponseDTO.LocationDTO locationDTO = new AlertResponseDTO.LocationDTO();
            locationDTO.setLatitude(alert.getLocation().getLatitude());
            locationDTO.setLongitude(alert.getLocation().getLongitude());
            responseDTO.setLocation(locationDTO);
        }

        // Ajouter user si disponible
        if (alert.getUser() != null) {
            AlertResponseDTO.UserDTO userDTO = new AlertResponseDTO.UserDTO();
            userDTO.setId(alert.getUser().getId());
            userDTO.setUsername(alert.getUser().getUsername());
            responseDTO.setUser(userDTO);
        }

        return new ResponseEntity<>(responseDTO, HttpStatus.OK);
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
        List<AlertResponseDTO> alertDTOs = alertsPage.getContent().stream()
                .map(alert -> {
                    AlertResponseDTO dto = new AlertResponseDTO();
                    dto.setId(alert.getId());
                    dto.setType(alert.getType());
                    dto.setDescription(alert.getDescription());
                    dto.setSeverity(alert.getSeverity());
                    dto.setStatus(alert.getStatus());
                    dto.setTimestamp(alert.getTimestamp());
                    dto.setNotes(alert.getNotes());
                    dto.setData(alert.getData());
                    if (alert.getLocation() != null) {
                        AlertResponseDTO.LocationDTO locationDTO = new AlertResponseDTO.LocationDTO();
                        locationDTO.setLatitude(alert.getLocation().getLatitude());
                        locationDTO.setLongitude(alert.getLocation().getLongitude());
                        dto.setLocation(locationDTO);
                    }
                    if (alert.getVehicle() != null) {
                        AlertResponseDTO.VehicleDTO vehicleDTO = new AlertResponseDTO.VehicleDTO();
                        vehicleDTO.setId(alert.getVehicle().getId());
                        vehicleDTO.setBrand(alert.getVehicle().getBrand());
                        vehicleDTO.setModel(alert.getVehicle().getModel());
                        vehicleDTO.setLicensePlate(alert.getVehicle().getLicensePlate());
                        dto.setCar(vehicleDTO);
                    }
                    if (alert.getUser() != null) {
                        AlertResponseDTO.UserDTO userDTO = new AlertResponseDTO.UserDTO();
                        userDTO.setId(alert.getUser().getId());
                        userDTO.setUsername(alert.getUser().getUsername());
                        dto.setUser(userDTO);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        Map<String, Object> response = new HashMap<>();
        response.put("data", alertDTOs);
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