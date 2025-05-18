package com.example.backend.service;

import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setColor(vehicleDetails.getColor());
        if (vehicleDetails.getLicensePlate() != null && !vehicleDetails.getLicensePlate().equals(vehicle.getLicensePlate())) {
            if (vehicleRepository.existsByLicensePlate(vehicleDetails.getLicensePlate())) {
                throw new RuntimeException("Vehicle with this license plate already exists");
            }
            vehicle.setLicensePlate(vehicleDetails.getLicensePlate());
        }
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
        userRepository.save(user);
    }

    public void removeVehicleFromUser(Long userId, Long vehicleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        user.removeVehicle(vehicle);
        userRepository.save(user);
    }
}