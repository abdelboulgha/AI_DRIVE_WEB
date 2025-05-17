
package com.example.backend.service;

import com.example.backend.dto.AuthResponseDTO;
import com.example.backend.dto.LoginRequestDTO;
import com.example.backend.dto.SignupRequestDTO;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Stockage simplifié des tokens (à remplacer par JWT en production)
    private final Map<String, Long> tokens = new HashMap<>();

    @Autowired
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDTO signup(SignupRequestDTO signupRequest) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Créer un nouvel utilisateur
        User user = new User(
                signupRequest.getUsername(),
                passwordEncoder.encode(signupRequest.getPassword()),
                signupRequest.getEmail()
        );

        // Sauvegarder l'utilisateur
        user = userRepository.save(user);

        // Générer un token
        String token = generateToken();
        tokens.put(token, user.getId());

        // Retourner la réponse
        return new AuthResponseDTO(token, user.getUsername(), user.getId());
    }

    public AuthResponseDTO login(LoginRequestDTO loginRequest) {
        // Trouver l'utilisateur
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid username or password");
        }

        User user = userOpt.get();

        // Vérifier le mot de passe
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        // Générer un token
        String token = generateToken();
        tokens.put(token, user.getId());

        // Retourner la réponse
        return new AuthResponseDTO(token, user.getUsername(), user.getId());
    }

    public User getUserByToken(String token) {
        // Retirer le préfixe "Bearer " si présent
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Long userId = tokens.get(token);
        if (userId == null) {
            throw new RuntimeException("Invalid or expired token");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    private String generateToken() {
        return UUID.randomUUID().toString();
    }


}