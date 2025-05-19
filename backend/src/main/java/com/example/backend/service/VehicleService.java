package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @Autowired
    public VehicleService(VehicleRepository vehicleRepository, UserRepository userRepository) {
        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Optional<Vehicle> findByLicensePlate(String licensePlate) {
        return vehicleRepository.findByLicensePlate(licensePlate);
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByLicensePlate(vehicle.getLicensePlate())) {
            throw new RuntimeException("Vehicle with this license plate already exists");
        }

        // Assurer que les nouveaux champs ont des valeurs par défaut si non spécifiés
        if (vehicle.getStatus() == null) {
            vehicle.setStatus("ACTIF");
        }
        if (vehicle.getLastActivity() == null) {
            vehicle.setLastActivity(LocalDateTime.now());
        }
        if (vehicle.getMileage() == null) {
            vehicle.setMileage(0L);
        }
        if (vehicle.getSafetyScore() == null) {
            vehicle.setSafetyScore(80);
        }
        if (vehicle.getFuelType() == null) {
            vehicle.setFuelType("Essence");
        }

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);

        // Attributs existants
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setColor(vehicleDetails.getColor());

        if (vehicleDetails.getLicensePlate() != null && !vehicleDetails.getLicensePlate().equals(vehicle.getLicensePlate())) {
            if (vehicleRepository.existsByLicensePlate(vehicleDetails.getLicensePlate())) {
                throw new RuntimeException("Vehicle with this license plate already exists");
            }
            vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
        }

        // Nouveaux attributs
        if (vehicleDetails.getYear() != null) {
            vehicle.setYear(vehicleDetails.getYear());
        }
        if (vehicleDetails.getMileage() != null) {
            vehicle.setMileage(vehicleDetails.getMileage());
        }
        if (vehicleDetails.getFuelType() != null) {
            vehicle.setFuelType(vehicleDetails.getFuelType());
        }
        if (vehicleDetails.getSafetyScore() != null) {
            vehicle.setSafetyScore(vehicleDetails.getSafetyScore());
        }
        if (vehicleDetails.getStatus() != null) {
            vehicle.setStatus(vehicleDetails.getStatus());
        }

        // Mettre à jour l'activité
        vehicle.updateActivity();

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }

    public List<Vehicle> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByUsersId(userId);
    }

    public void assignVehicleToUser(Long userId, Long vehicleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        user.addVehicle(vehicle);
        vehicle.updateActivity();
        userRepository.save(user);
    }

    public void removeVehicleFromUser(Long userId, Long vehicleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        user.removeVehicle(vehicle);
        vehicle.updateActivity();
        userRepository.save(user);
    }

    // Nouvelles méthodes

    public List<Vehicle> getVehiclesByStatus(String status) {
        return vehicleRepository.findByStatus(status);
    }

    public List<Vehicle> getVehiclesByUserIdAndStatus(Long userId, String status) {
        return vehicleRepository.findByUsersIdAndStatus(userId, status);
    }

    public List<Vehicle> getVehiclesByFuelType(String fuelType) {
        return vehicleRepository.findByFuelType(fuelType);
    }

    public void updateVehicleMileage(Long id, Long newMileage) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setMileage(newMileage);
        vehicle.updateActivity();
        vehicleRepository.save(vehicle);
    }

    public void updateVehicleStatus(Long id, String status) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setStatus(status);
        vehicle.updateActivity();
        vehicleRepository.save(vehicle);
    }

    // Méthodes pour les statistiques

    public Map<String, Object> getVehicleStats() {
        Map<String, Object> stats = new HashMap<>();

        Long totalCount = vehicleRepository.count();
        Long activeCount = vehicleRepository.countByStatus("ACTIF");
        Long inactiveCount = vehicleRepository.countByStatus("INACTIF");

        stats.put("totalCars", totalCount);
        stats.put("activeCars", activeCount);
        stats.put("inactiveCars", inactiveCount);

        // Score de sécurité moyen
        Double avgSafetyScore = vehicleRepository.getAverageSafetyScore();
        stats.put("avgSafetyScore", avgSafetyScore != null ? avgSafetyScore.intValue() : 0);

        // Répartition des scores de sécurité
        Map<String, Long> safetyScoreRanges = new HashMap<>();
        safetyScoreRanges.put("excellent", vehicleRepository.countBySafetyScoreRange(90, 100));
        safetyScoreRanges.put("good", vehicleRepository.countBySafetyScoreRange(80, 89));
        safetyScoreRanges.put("average", vehicleRepository.countBySafetyScoreRange(70, 79));
        safetyScoreRanges.put("poor", vehicleRepository.countBySafetyScoreRange(0, 69));
        stats.put("safetyScoreRanges", safetyScoreRanges);

        // Statistiques par type de carburant
        List<Object[]> fuelStats = vehicleRepository.countByFuelType();
        List<Map<String, Object>> fuelStatsFormatted = new ArrayList<>();

        for (Object[] row : fuelStats) {
            String fuelType = (String) row[0];
            Long count = (Long) row[1];
            double percentage = (count * 100.0) / totalCount;

            Map<String, Object> fuelStat = new HashMap<>();
            fuelStat.put("fuelType", fuelType);
            fuelStat.put("count", count);
            fuelStat.put("percentage", Math.round(percentage));

            fuelStatsFormatted.add(fuelStat);
        }
        stats.put("fuelStats", fuelStatsFormatted);

        // Statistiques par marque
        List<Object[]> brandStats = vehicleRepository.countByBrand();
        List<Map<String, Object>> brandStatsFormatted = new ArrayList<>();

        for (Object[] row : brandStats) {
            String brand = (String) row[0];
            Long count = (Long) row[1];
            double percentage = (count * 100.0) / totalCount;

            Map<String, Object> brandStat = new HashMap<>();
            brandStat.put("brand", brand);
            brandStat.put("count", count);
            brandStat.put("percentage", Math.round(percentage));

            brandStatsFormatted.add(brandStat);
        }
        stats.put("brandStats", brandStatsFormatted);

        // Kilométrage total
        Long totalMileage = vehicleRepository.getTotalMileage();
        stats.put("totalMileage", totalMileage != null ? totalMileage : 0);

        // Nombre d'alertes (simulé pour l'instant)
        stats.put("alertsCount", 0);

        return stats;
    }

    public Map<String, Object> getVehicleStatsByUserId(Long userId) {
        // Logique similaire à getVehicleStats mais filtrée par userId
        // Implémentation à adapter selon vos besoins

        Map<String, Object> stats = new HashMap<>();
        List<Vehicle> userVehicles = vehicleRepository.findByUsersId(userId);

        long totalCount = userVehicles.size();
        long activeCount = userVehicles.stream().filter(v -> "ACTIF".equals(v.getStatus())).count();

        stats.put("totalCars", totalCount);
        stats.put("activeCars", activeCount);
        stats.put("inactiveCars", totalCount - activeCount);

        // Autres statistiques...

        return stats;
    }
}