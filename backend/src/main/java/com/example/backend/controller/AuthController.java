package com.example.backend.controller;

import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.SignupRequestDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDTO> signup(@RequestBody SignupRequestDTO signupRequest) {
        try {
            AuthResponseDTO response = authService.signup(signupRequest);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            throw new RuntimeException("Error during signup: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            AuthResponseDTO response = authService.login(loginRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error during login: " + e.getMessage());
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving users: " + e.getMessage());
        }
    }

    //yarbiii

    @DeleteMapping("/users/delete-unsecured/{id}")
    public ResponseEntity<?> deleteUserUnsecured(@PathVariable Long id) {
        try {
            // Vérifier si l'utilisateur existe
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID: " + id));

            // Supprimer les relations avec les véhicules
            List<Vehicle> vehicles = new ArrayList<>(user.getVehicles());
            for (Vehicle vehicle : vehicles) {
                user.removeVehicle(vehicle);
            }

            // Sauvegarder les changements dans les relations avant de supprimer l'utilisateur
            userRepository.save(user);

            // Supprimer l'utilisateur
            userRepository.delete(user);

            return new ResponseEntity<>(
                    Map.of("message", "Utilisateur supprimé avec succès (sans sécurité)", "userId", id),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    Map.of("error", "Erreur lors de la suppression de l'utilisateur: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}