package com.example.backend.repository;

import com.example.backend.entity.Alert;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    Page<Alert> findByUser(User user, Pageable pageable);
    Page<Alert> findByVehicle(Vehicle vehicle, Pageable pageable);
    Page<Alert> findByStatus(String status, Pageable pageable);
    Page<Alert> findByStatusAndUser(String status, User user, Pageable pageable);
    Page<Alert> findByStatusAndVehicle(String status, Vehicle vehicle, Pageable pageable);
    Page<Alert> findBySeverity(String severity, Pageable pageable);
    Page<Alert> findByType(String type, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.status = ?1")
    long countByStatus(String status);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.severity = ?1")
    long countBySeverity(String severity);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.type = ?1")
    long countByType(String type);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user = ?1")
    long countByUser(User user);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.vehicle = ?1")
    long countByVehicle(Vehicle vehicle);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.user = ?1 AND a.status = ?2")
    long countByUserAndStatus(User user, String status);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.vehicle = ?1 AND a.status = ?2")
    long countByVehicleAndStatus(Vehicle vehicle, String status);

    @Query("SELECT a.vehicle.id, COUNT(a) FROM Alert a GROUP BY a.vehicle.id ORDER BY COUNT(a) DESC")
    List<Object[]> countGroupByVehicle(Pageable pageable);

    @Query("SELECT HOUR(a.timestamp), COUNT(a) FROM Alert a GROUP BY HOUR(a.timestamp)")
    List<Object[]> countGroupByHour();

    @Query("SELECT DAYOFWEEK(a.timestamp), COUNT(a) FROM Alert a GROUP BY DAYOFWEEK(a.timestamp)")
    List<Object[]> countGroupByDayOfWeek();
}