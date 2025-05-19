package com.example.backend.service;

import com.example.backend.dto.AlertRequestDTO;
import com.example.backend.dto.AlertResponseDTO;
import com.example.backend.dto.AlertStatsDTO;
import com.example.backend.entity.Alert;
import com.example.backend.entity.Location;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.AlertRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VehicleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @Autowired
    public AlertService(AlertRepository alertRepository, UserRepository userRepository, VehicleRepository vehicleRepository) {
        this.alertRepository = alertRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public Alert createAlert(AlertRequestDTO requestDTO) {
        try {
            User user = null;
            Vehicle vehicle = null;

            if (requestDTO.getUserId() != null) {
                user = userRepository.findById(requestDTO.getUserId())
                        .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            }

            if (requestDTO.getVehicleId() != null) {
                vehicle = vehicleRepository.findById(requestDTO.getVehicleId())
                        .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
            }

            Alert alert = new Alert();
            alert.setType(requestDTO.getType());
            alert.setDescription(requestDTO.getDescription());
            alert.setSeverity(requestDTO.getSeverity());
            alert.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : "NEW");
            alert.setTimestamp(LocalDateTime.now());
            alert.setUser(user);
            alert.setVehicle(vehicle);
            alert.setNotes(requestDTO.getNotes());

            // CORRECTION : Transformer la chaîne en JSON valide si nécessaire
            // Dans la méthode createAlert de AlertService.java
            if (requestDTO.getData() != null) {
                // Le UserType s'occupera de la validation et de la conversion
                alert.setData(requestDTO.getData());
            }

            // Gestion de la localisation
            if (requestDTO.getLatitude() != null && requestDTO.getLongitude() != null) {
                Location location = new Location(requestDTO.getLatitude(), requestDTO.getLongitude());
                alert.setLocation(location);
            }

            return alertRepository.save(alert);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'alerte: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Alert getAlertById(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée"));
    }

    public Page<Alert> getAllAlerts(int page, int size, String sort) {
        Sort.Direction direction = Sort.Direction.DESC;
        String property = "timestamp";

        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(":");
            property = parts[0];
            if (parts.length > 1 && parts[1].equalsIgnoreCase("asc")) {
                direction = Sort.Direction.ASC;
            }
        }

        return alertRepository.findAll(
                PageRequest.of(page - 1, size, Sort.by(direction, property))
        );
    }

    public Page<Alert> getAlertsByUserId(Long userId, int page, int size, String sort) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Sort.Direction direction = Sort.Direction.DESC;
        String property = "timestamp";

        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(":");
            property = parts[0];
            if (parts.length > 1 && parts[1].equalsIgnoreCase("asc")) {
                direction = Sort.Direction.ASC;
            }
        }

        return alertRepository.findByUser(
                user,
                PageRequest.of(page - 1, size, Sort.by(direction, property))
        );
    }

    public Page<Alert> getAlertsByVehicleId(Long vehicleId, int page, int size, String sort) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));

        Sort.Direction direction = Sort.Direction.DESC;
        String property = "timestamp";

        if (sort != null && !sort.isEmpty()) {
            String[] parts = sort.split(":");
            property = parts[0];
            if (parts.length > 1 && parts[1].equalsIgnoreCase("asc")) {
                direction = Sort.Direction.ASC;
            }
        }

        return alertRepository.findByVehicle(
                vehicle,
                PageRequest.of(page - 1, size, Sort.by(direction, property))
        );
    }

    public Alert updateAlert(Long id, AlertRequestDTO requestDTO) {
        Alert alert = getAlertById(id);

        if (requestDTO.getType() != null) {
            alert.setType(requestDTO.getType());
        }

        if (requestDTO.getDescription() != null) {
            alert.setDescription(requestDTO.getDescription());
        }

        if (requestDTO.getSeverity() != null) {
            alert.setSeverity(requestDTO.getSeverity());
        }

        if (requestDTO.getStatus() != null) {
            alert.setStatus(requestDTO.getStatus());
        }

        if (requestDTO.getNotes() != null) {
            alert.setNotes(requestDTO.getNotes());
        }

        if (requestDTO.getData() != null) {
            alert.setData(requestDTO.getData());
        }

        if (requestDTO.getLatitude() != null && requestDTO.getLongitude() != null) {
            Location location = new Location(requestDTO.getLatitude(), requestDTO.getLongitude());
            alert.setLocation(location);
        }

        return alertRepository.save(alert);
    }

    public void deleteAlert(Long id) {
        Alert alert = getAlertById(id);
        alertRepository.delete(alert);
    }

    public AlertStatsDTO getAlertStats(Long userId, Long vehicleId) {
        AlertStatsDTO stats = new AlertStatsDTO();
        long total;

        // Statistiques de base
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            total = alertRepository.countByUser(user);
            // Compléter avec les autres stats par utilisateur
        } else if (vehicleId != null) {
            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
            total = alertRepository.countByVehicle(vehicle);
            // Compléter avec les autres stats par véhicule
        } else {
            total = alertRepository.count();

            // Statistiques par sévérité
            Map<String, Long> severityStats = new HashMap<>();
            severityStats.put("high", alertRepository.countBySeverity("HIGH"));
            severityStats.put("medium", alertRepository.countBySeverity("MEDIUM"));
            severityStats.put("low", alertRepository.countBySeverity("LOW"));
            stats.setSeverityStats(severityStats);

            // Statistiques par statut
            Map<String, Long> statusStats = new HashMap<>();
            statusStats.put("new", alertRepository.countByStatus("NEW"));
            statusStats.put("acknowledged", alertRepository.countByStatus("ACKNOWLEDGED"));
            statusStats.put("resolved", alertRepository.countByStatus("RESOLVED"));
            stats.setStatusStats(statusStats);

            // Top véhicules
            Pageable topFive = PageRequest.of(0, 5);
            List<Object[]> topCarsData = alertRepository.countGroupByVehicle(topFive);

            List<AlertStatsDTO.CarStatDTO> topCars = new ArrayList<>();
            for (Object[] row : topCarsData) {
                Long carId = (Long) row[0];
                Long count = (Long) row[1];

                Vehicle vehicle = vehicleRepository.findById(carId).orElse(null);
                if (vehicle != null) {
                    AlertStatsDTO.CarStatDTO carStat = new AlertStatsDTO.CarStatDTO();
                    carStat.setCarId(carId);
                    carStat.setBrand(vehicle.getBrand());
                    carStat.setModel(vehicle.getModel());
                    carStat.setLicensePlate(vehicle.getLicensePlate());
                    carStat.setCount(count);
                    carStat.setPercentage(((double) count / total) * 100);
                    topCars.add(carStat);
                }
            }
            stats.setTopCars(topCars);

            // Statistiques temporelles
            AlertStatsDTO.TimeStatsDTO timeStats = new AlertStatsDTO.TimeStatsDTO();

            // Par heure
            List<Object[]> hourlyData = alertRepository.countGroupByHour();
            List<AlertStatsDTO.TimeStatsDTO.HourStatDTO> hourlyStats = new ArrayList<>();

            for (Object[] row : hourlyData) {
                Integer hour = (Integer) row[0];
                Long count = (Long) row[1];

                AlertStatsDTO.TimeStatsDTO.HourStatDTO hourStat = new AlertStatsDTO.TimeStatsDTO.HourStatDTO();
                hourStat.setHour(hour);
                hourStat.setCount(count);
                hourlyStats.add(hourStat);
            }
            timeStats.setByHour(hourlyStats);

            // Par jour de la semaine
            List<Object[]> dailyData = alertRepository.countGroupByDayOfWeek();
            List<AlertStatsDTO.TimeStatsDTO.DayStatDTO> dailyStats = new ArrayList<>();

            String[] dayNames = {"Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"};

            for (Object[] row : dailyData) {
                Integer day = (Integer) row[0];
                Long count = (Long) row[1];

                AlertStatsDTO.TimeStatsDTO.DayStatDTO dayStat = new AlertStatsDTO.TimeStatsDTO.DayStatDTO();
                dayStat.setDay(day);
                dayStat.setDayName(dayNames[day - 1]);
                dayStat.setCount(count);
                dailyStats.add(dayStat);
            }
            timeStats.setByDay(dailyStats);

            stats.setTimeStats(timeStats);
        }

        stats.setTotalAlerts(total);
        return stats;
    }
}