package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.AuthService;
import com.example.backend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;
    private final AuthService authService;
    private VehicleRepository vehicleRepository;

    @Autowired
    public VehicleController(VehicleService vehicleService, AuthService authService, VehicleRepository vehicleRepository) {
        this.vehicleService = vehicleService;
        this.authService = authService;
        this.vehicleRepository = vehicleRepository;  // Initialisation dans le constructeur
    }

    // Méthodes existantes
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

    @PostMapping("/vehicles/create")
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        try {
            // Vérification si un véhicule avec la même plaque existe déjà
            if (vehicleRepository.existsByLicensePlate(vehicle.getLicensePlate())) {
                throw new RuntimeException("Un véhicule avec cette plaque d'immatriculation existe déjà");
            }

            // Si les valeurs par défaut ne sont pas définies, les configurer
            if (vehicle.getStatus() == null) {
                vehicle.setStatus("ACTIF");
            }

            if (vehicle.getLastActivity() == null) {
                vehicle.setLastActivity(LocalDateTime.now());
            }

            // Enregistrer le véhicule
            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            return new ResponseEntity<>(savedVehicle, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création du véhicule: " + e.getMessage());
        }
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

    // Nouveaux endpoints

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getVehicleStats() {
        Map<String, Object> stats = vehicleService.getVehicleStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/stats/user")
    public ResponseEntity<Map<String, Object>> getUserVehicleStats(
            @RequestHeader("Authorization") String token) {
        User user = authService.getUserByToken(token);
        Map<String, Object> stats = vehicleService.getVehicleStatsByUserId(user.getId());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Vehicle>> getVehiclesByStatus(
            @PathVariable String status) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByStatus(status);
        return ResponseEntity.ok(vehicles);
    }



    @GetMapping("/fuel-type/{fuelType}")
    public ResponseEntity<List<Vehicle>> getVehiclesByFuelType(
            @PathVariable String fuelType) {
        List<Vehicle> vehicles = vehicleService.getVehiclesByFuelType(fuelType);
        return ResponseEntity.ok(vehicles);
    }

    @PatchMapping("/{id}/mileage")
    public ResponseEntity<?> updateVehicleMileage(
            @PathVariable Long id,
            @RequestParam Long mileage,
            @RequestHeader("Authorization") String token) {
        // Vérifier l'authentification
        authService.getUserByToken(token);

        vehicleService.updateVehicleMileage(id, mileage);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateVehicleStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("Authorization") String token) {
        // Vérifier l'authentification
        authService.getUserByToken(token);

        vehicleService.updateVehicleStatus(id, status);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/constants")
    public ResponseEntity<Map<String, Object>> getVehicleConstants() {
        // Renvoyer les constantes statiques pour l'interface utilisateur
        Map<String, Object> constants = Map.of(
                "vehicleColors", List.of(
                        Map.of("name", "Rouge", "hexCode", "#f44336"),
                        Map.of("name", "Bleu", "hexCode", "#2196f3"),
                        Map.of("name", "Vert", "hexCode", "#4caf50"),
                        Map.of("name", "Jaune", "hexCode", "#ffeb3b"),
                        Map.of("name", "Noir", "hexCode", "#212121"),
                        Map.of("name", "Blanc", "hexCode", "#f5f5f5"),
                        Map.of("name", "Gris", "hexCode", "#9e9e9e")
                ),
                "fuelTypes", List.of(
                        Map.of("id", 1, "name", "Essence", "color", "#f44336"),
                        Map.of("id", 2, "name", "Diesel", "color", "#ff9800"),
                        Map.of("id", 3, "name", "Hybride", "color", "#4caf50"),
                        Map.of("id", 4, "name", "Électrique", "color", "#2196f3")
                ),
                "statusOptions", List.of(
                        Map.of("value", "ACTIF", "label", "Actif", "color", "success"),
                        Map.of("value", "INACTIF", "label", "Inactif", "color", "default")
                )
        );

        return ResponseEntity.ok(constants);
    }
}