package com.example.userService.services;

import com.example.userService.entities.UserEntity;
import com.example.userService.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LocalUserRoleService {

    @Autowired
    private UserRepository userRepository;

    public Optional<UserEntity> findUserByToken(Jwt jwt) {
        if (jwt == null) return Optional.empty();

        // 1️⃣ Récupérer les infos du token
        String keycloakId = jwt.getClaim("sub");                  // ID Keycloak
        String username = jwt.getClaim("preferred_username");    // username
        String email = jwt.getClaim("email");                    // email

        System.out.println("JWT sub: " + keycloakId);
        System.out.println("JWT username: " + username);
        System.out.println("JWT email: " + email);

        // 2️⃣ Chercher l'utilisateur par Keycloak ID
        Optional<UserEntity> userOpt = userRepository.findByKeycloakid(keycloakId);

        // 3️⃣ Si non trouvé, fallback sur username ou email
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findAll().stream()
                    .filter(u -> (username != null && username.equalsIgnoreCase(u.getUsername()))
                            || (email != null && email.equalsIgnoreCase(u.getEmail())))
                    .findFirst();
        }

        // 4️⃣ Mapper le keycloakId dans la DB si trouvé via username/email
        userOpt.ifPresent(u -> {
            if (u.getKeycloakid() == null || u.getKeycloakid().isEmpty()) {
                u.setKeycloakid(keycloakId);
                userRepository.save(u); // met à jour la DB locale
            }
        });

        return userOpt;
    }
}
