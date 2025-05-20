package com.example.backend.controller;

import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.SignupRequestDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.AuthService;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.hibernate.Hibernate;
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
    private EntityManager entityManager;

    @Autowired
    public AuthController(AuthService authService, UserRepository userRepository,EntityManager entityManager) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.entityManager = entityManager;
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

            // Initialiser explicitement les collections lazy
            for (User user : users) {
                Hibernate.initialize(user.getVehicles());
            }

            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error retrieving users: " + e.getMessage());
        }
    }

    //yarbiii

    @DeleteMapping("/users/delete-unsecured/{id}")
    @Transactional  // <-- Ajoutez cette annotation !
    public ResponseEntity<?> deleteUserUnsecured(@PathVariable Long id) {
        try {
            // Vérifier si l'utilisateur existe
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID: " + id));

            // Approche avec SQL natif et paramètre positionnel
            entityManager.createNativeQuery("DELETE FROM alerts WHERE user_id = ?")
                    .setParameter(1, id)
                    .executeUpdate();

            // Supprimer les données de l'accéléromètre
            entityManager.createNativeQuery("DELETE FROM accelerometer_data WHERE user_id = ?")
                    .setParameter(1, id)
                    .executeUpdate();

            // Supprimer les données GPS
            entityManager.createNativeQuery("DELETE FROM gps_data WHERE user_id = ?")
                    .setParameter(1, id)
                    .executeUpdate();

            // Supprimer les données du gyroscope
            entityManager.createNativeQuery("DELETE FROM gyroscope_data WHERE user_id = ?")
                    .setParameter(1, id)
                    .executeUpdate();

            // Supprimer les relations avec les véhicules
            entityManager.createNativeQuery("DELETE FROM user_vehicles WHERE user_id = ?")
                    .setParameter(1, id)
                    .executeUpdate();

            // Supprimer l'utilisateur
            entityManager.createNativeQuery("DELETE FROM users WHERE id = ?")
                    .setParameter(1, id)
                    .executeUpdate();

            return new ResponseEntity<>(
                    Map.of("message", "Utilisateur supprimé avec succès (sans sécurité)", "userId", id),
                    HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    Map.of("error", "Erreur lors de la suppression de l'utilisateur: " + e.getMessage()),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}