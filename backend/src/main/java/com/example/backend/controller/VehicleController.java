package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.service.AuthService;
import com.example.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;
    private final AuthService authService;

    @Autowired
    public VehicleController(VehicleService vehicleService, AuthService authService) {
        this.vehicleService = vehicleService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        return new ResponseEntity<>(vehicle, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(
            @RequestBody Vehicle vehicle,
            @RequestHeader("Authorization") String token) {
        // Vérifier l'authentification
        authService.getUserByToken(token);

        Vehicle savedVehicle = vehicleService.saveVehicle(vehicle);
        return new ResponseEntity<>(savedVehicle, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicleDetails,
            @RequestHeader("Authorization") String token) {
        // Vérifier l'authentification
        authService.getUserByToken(token);

        Vehicle updatedVehicle = vehicleService.updateVehicle(id, vehicleDetails);
        return new ResponseEntity<>(updatedVehicle, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehicle(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        // Vérifier l'authentification
        authService.getUserByToken(token);

        vehicleService.deleteVehicle(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Vehicle>> getVehiclesByUser(
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        List<Vehicle> vehicles = vehicleService.getVehiclesByUserId(user.getId());
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

    @PostMapping("/{vehicleId}/assign")
    public ResponseEntity<?> assignVehicleToUser(
            @PathVariable Long vehicleId,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        vehicleService.assignVehicleToUser(user.getId(), vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/{vehicleId}/remove")
    public ResponseEntity<?> removeVehicleFromUser(
            @PathVariable Long vehicleId,
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        vehicleService.removeVehicleFromUser(user.getId(), vehicleId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}