package com.example.backend.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = true)  // Rendre le champ nullable
    private String telephone;

    @Column(nullable = false)
    private String status = "ACTIF"; // Valeur par défaut

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AccelerometerData> accelerometerData = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GPSData> gpsData = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GyroscopeData> gyroscopeData = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "user_vehicles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "vehicle_id")
    )
    private List<Vehicle> vehicles = new ArrayList<>();

    // Constructeurs
    public User() {
    }

    public User(String username, String password, String email, String telephone) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.telephone = telephone;
        this.status = "ACTIF";
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<AccelerometerData> getAccelerometerData() {
        return accelerometerData;
    }

    public void setAccelerometerData(List<AccelerometerData> accelerometerData) {
        this.accelerometerData = accelerometerData;
    }

    public List<GPSData> getGpsData() {
        return gpsData;
    }

    public void setGpsData(List<GPSData> gpsData) {
        this.gpsData = gpsData;
    }

    public List<GyroscopeData> getGyroscopeData() {
        return gyroscopeData;
    }

    public void setGyroscopeData(List<GyroscopeData> gyroscopeData) {
        this.gyroscopeData = gyroscopeData;
    }

    public List<Vehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(List<Vehicle> vehicles) {
        this.vehicles = vehicles;
    }

    // Méthodes utilitaires pour la gestion des relations
    public void addVehicle(Vehicle vehicle) {
        this.vehicles.add(vehicle);
        vehicle.getUsers().add(this);
    }

    public void removeVehicle(Vehicle vehicle) {
        this.vehicles.remove(vehicle);
        vehicle.getUsers().remove(this);
    }
}