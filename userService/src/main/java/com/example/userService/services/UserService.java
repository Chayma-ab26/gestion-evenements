package com.example.userService.services;

import com.example.userService.config.keycloakConfig;
import com.example.userService.entities.UserEntity;
import com.example.userService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

public class UserService {

    @Autowired
    private UserRepository userRepository;
@Autowired
private keycloakConfig keycloakConfig;
    @Autowired
    private KeycloakUserService keycloakUserService;

    private PasswordEncoder passwordEncoder;
    public UserEntity createUser(UserEntity user) {
        return userRepository.save(user);
    }
    public List<UserEntity> getAllUser() {
        return userRepository.findAll();
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

//


    public void register(UserEntity user, String password) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Nom d'utilisateur déjà utilisé");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // 🔐 Créer dans Keycloak avec rôle
        String keycloakId = keycloakUserService.createUser(
                user.getUsername(),
                password,
                user.getEmail(),
                user.getRole()
        );
        user.setKeycloakid(keycloakId);

        // 🔒 Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(password));

        // 🗄️ Enregistrer dans la base
        userRepository.save(user);
    }


}

