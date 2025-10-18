package com.example.userService.services;

import com.example.userService.config.keycloakConfig;
import com.example.userService.entities.UserEntity;
import com.example.userService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private keycloakConfig keycloakConfig;
    @Autowired
    private KeycloakUserService keycloakUserService;

    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }

    public UserEntity getOne(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public UserEntity updateUser(UserEntity user) {
        return userRepository.save(user);
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public void registerUser(UserEntity user, String password) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // 1. Créer dans Keycloak
        keycloakUserService.createUser(user.getUsername(), password,user.getFirstname(),
                user.getLastname(),user.getRole());

        // 2. Enregistrer dans la base de données locale
        userRepository.save(user);
    }
    public Optional<UserEntity> findByKeycloakid(String keycloakid) {
        return userRepository.findByKeycloakid(keycloakid);
    }


}

