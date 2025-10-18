package com.example.userService.controllers;


import com.example.userService.entities.UserDTO;
import com.example.userService.entities.UserEntity;
import com.example.userService.repositories.UserRepository;
import com.example.userService.services.*;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    StorageService storageService;
    @Autowired
    KeycloakUserService keycloakUserService;
    @Autowired
    LocalUserRoleService localUserRoleService;
   @Autowired
    UserRepository userRepository;

//    @PostMapping("/create")
//    public UserEntity createUser(@ModelAttribute UserEntity user, @RequestParam("file") MultipartFile file) {
//        if (file.isEmpty()) {
//            throw new RuntimeException("Le fichier est vide");
//        }
//        String namephoto = storageService.store(file);
//        user.setPhoto(namephoto);
//
//        keycloakUserService.createUser(user.getUsername(),user.getPassword());
//        return userService.createUser(user);
//    }
@PostMapping("/create")
public UserEntity createUser(@ModelAttribute UserEntity user, @RequestParam("file") MultipartFile file) {
    if (file.isEmpty()) {
        throw new RuntimeException("Le fichier est vide");
    }

    String namePhoto = storageService.store(file);
    user.setPhoto(namePhoto);

    // Création de l'utilisateur dans Keycloak
    String keycloakId= keycloakUserService.createUser(user.getUsername(), user.getPassword(),user.getFirstname(),
            user.getLastname(),user.getRole());
    // 🔹 Sauvegarder le keycloakId dans ta DB locale
    user.setKeycloakid(keycloakId);
    // Sauvegarde dans votre base locale
    return userService.createUser(user);
}

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO request) {
        try {
            UserEntity user = new UserEntity();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setRole(request.getRole()); // exemple

            userService.registerUser(user, request.getPassword());

            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed");
        }
    }
    @GetMapping("/getbyid/{id}")
    public UserEntity getUserById(@PathVariable Long id  ) {
        return userService.getOne(id);
    }


    @GetMapping("/getall")
    public List<UserEntity> getAllUser() {
        return userService.getAllUsers() ;

    }

    @DeleteMapping("/delete/{id}")
    public void deleteUserById(@PathVariable Long id) {
        userService.deleteUser(id);
    }



    @PutMapping("/update/{id}")
    public UserEntity updateUserById(@PathVariable Long id,  UserEntity user) {
        //save id
        user.setId(id);
        //recuperation objet ancien
        UserEntity old = userService.getOne(id);
        if(user.getUsername() ==null) {user.setUsername(old.getUsername());}
        if(user.getRole() ==null) {user.setRole(old.getRole());}
        if(user.getPassword() ==null) {user.setPassword(old.getPassword());}
        if(user.getEmail() ==null) {user.setEmail(old.getEmail());}
        if(user.getLastname() ==null) {user.setLastname(old.getLastname());}
        if(user.getFirstname() ==null) {user.setFirstname(old.getFirstname());}
        if (user.getPhoto() ==null) {user.setPhoto(old.getPhoto());}
        if (user.getPhone() ==null) {user.setPhoto(old.getPhoto());}

        return userService.updateUser(user);

    }

//    @GetMapping("/me")
//    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
//        return localUserRoleService.findUserByToken(jwt)
//                .map(user -> ResponseEntity.ok().body(Map.of(
//                        "id", user.getId(),
//                        "firstname", user.getFirstname(),
//                        "lastname", user.getLastname(),
//                        "username", user.getUsername(),
//                        "role", user.getRole()
//                )))
//                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body(Map.of("error", "Utilisateur introuvable dans la base locale")));
//    }
//
//

//    @GetMapping("/me")
//    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
//        return localUserRoleService.findUserByToken(jwt)
//                .map(user -> ResponseEntity.ok().body(Map.of(
//                        "id", user.getId(),
//                        "firstname", user.getFirstname(),
//                        "lastname", user.getLastname(),
//                        "username", user.getUsername(),
//                        "role", user.getRole(),
//                        "keycloakid", user.getKeycloakid()
//                )))
//                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
//                        .body(Map.of("error", "Utilisateur introuvable dans la base locale")));
//    }
//
@GetMapping("/me")
public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
    try {
        return localUserRoleService.findUserByToken(jwt)
                .map(user -> ResponseEntity.ok(Map.of(
                        "id", user.getId(),
                        "keycloakid", user.getKeycloakid(),
                        "username", user.getUsername(),
                        "firstname", user.getFirstname(),
                        "lastname", user.getLastname(),
                        "role", user.getRole()
                )))
                .orElseGet(() -> {
                    // Si non trouvé → considéré admin
                    String username = jwt.getClaimAsString("preferred_username");
                    String firstname = jwt.getClaimAsString("given_name");
                    String lastname = jwt.getClaimAsString("family_name");
                    String email = jwt.getClaimAsString("email");
                    String keycloakId = jwt.getSubject();

                    // Défaut si claim absent
                    if (username == null) username = "admin";
                    if (firstname == null) firstname = "Admin";
                    if (lastname == null) lastname = "";
                    if (email == null) email = "admin@keycloak.local";

                    return ResponseEntity.ok(Map.of(
                            "keycloakid", keycloakId,
                            "username", username,
                            "firstname", firstname,
                            "lastname", lastname,
                            "email", email,
                            "role", "admin"
                    ));
                });
    } catch (Exception e) {
        e.printStackTrace(); // pour debug
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Impossible de récupérer l'utilisateur"));
    }
}


    @GetMapping("/by-keycloak/{keycloakId}")
    public Long getUserIdByKeycloakId(@PathVariable String keycloakId) {
        return userRepository.findByKeycloakid(keycloakId)
                .map(UserEntity::getId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.loadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }


}

