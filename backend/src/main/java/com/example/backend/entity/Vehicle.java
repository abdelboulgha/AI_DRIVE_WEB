package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String licensePlate;  // Plaque d'immatriculation

    @Column(nullable = false)
    private String brand;  // Marque

    @Column(nullable = false)
    private String model;  // Modèle

    @Column
    private String color;  // Couleur

    // Nouveaux attributs
    @Column
    private Integer year;  // Année de fabrication

    @Column
    private Long mileage = 0L;  // Kilométrage

    @Column
    private String fuelType = "Essence";  // Type de carburant (Essence, Diesel, Hybride, Électrique)

    @Column
    private Integer safetyScore = 80;  // Score de sécurité (0-100)

    @Column(nullable = false)
    private String status = "ACTIF";  // Statut (ACTIF ou INACTIF)

    @Column
    private LocalDateTime lastActivity = LocalDateTime.now();  // Dernière activité

    @ManyToMany(mappedBy = "vehicles")
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    // Constructeurs
    public Vehicle() {
    }

    public Vehicle(String licensePlate, String brand, String model, String color) {
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.status = "ACTIF";
        this.lastActivity = LocalDateTime.now();
    }

    // Nouveau constructeur complet
    public Vehicle(String licensePlate, String brand, String model, String color,
                   Integer year, Long mileage, String fuelType, Integer safetyScore) {
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.color = color;
        this.year = year;
        this.mileage = mileage;
        this.fuelType = fuelType;
        this.safetyScore = safetyScore;
        this.status = "ACTIF";
        this.lastActivity = LocalDateTime.now();
    }

    // Getters et Setters existants
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    // Nouveaux getters et setters
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getMileage() {
        return mileage;
    }

    public void setMileage(Long mileage) {
        this.mileage = mileage;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public Integer getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(Integer safetyScore) {
        this.safetyScore = safetyScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    // Méthode pour mettre à jour l'activité
    public void updateActivity() {
        this.lastActivity = LocalDateTime.now();
    }
}