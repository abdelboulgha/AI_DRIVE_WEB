package com.example.backend.repository;

import com.example.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    boolean existsByLicensePlate(String licensePlate);
    List<Vehicle> findByUsersId(Long userId);

    // Nouvelles méthodes
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByUsersIdAndStatus(Long userId, String status);
    List<Vehicle> findByFuelType(String fuelType);
    List<Vehicle> findByYearBetween(Integer startYear, Integer endYear);

    @Query("SELECT AVG(v.safetyScore) FROM Vehicle v")
    Double getAverageSafetyScore();

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.status = ?1")
    Long countByStatus(String status);

    @Query("SELECT v.fuelType, COUNT(v) FROM Vehicle v GROUP BY v.fuelType")
    List<Object[]> countByFuelType();

    @Query("SELECT v.brand, COUNT(v) FROM Vehicle v GROUP BY v.brand")
    List<Object[]> countByBrand();

    @Query("SELECT SUM(v.mileage) FROM Vehicle v")
    Long getTotalMileage();

    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.safetyScore >= ?1 AND v.safetyScore <= ?2")
    Long countBySafetyScoreRange(Integer min, Integer max);
}