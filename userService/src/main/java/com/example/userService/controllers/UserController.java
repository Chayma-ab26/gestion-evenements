package com.example.userService.controllers;


import com.example.userService.entities.UserDTO;
import com.example.userService.entities.UserEntity;
import com.example.userService.services.KeycloakUserService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import com.example.userService.services.StorageService;
import com.example.userService.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    StorageService storageService;
    @Autowired
    KeycloakUserService keycloakUserService;

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
    keycloakUserService.createUser(user.getUsername(), user.getPassword(),user.getFirstname(),
            user.getLastname(),user.getRole());

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




    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.loadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

}

