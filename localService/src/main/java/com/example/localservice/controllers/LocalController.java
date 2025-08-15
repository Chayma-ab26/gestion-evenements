package com.example.localservice.controllers;

import com.example.localservice.entities.LocalEntity;
import com.example.localservice.repositories.LocalRepository;
import com.example.localservice.services.LocalService;
import com.example.localservice.services.StorageService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.bouncycastle.asn1.x500.style.RFC4519Style.name;

@RestController
@RequestMapping("/locals")
@CrossOrigin(origins = "*")
public class LocalController {
    @Autowired
    private LocalService localService;
    @Autowired
    private StorageService storageService;
    @Autowired
    private LocalRepository localRepository;

    // Créer un local
    @PostMapping("/create")
    public LocalEntity createLocal(@RequestParam("name") String name,
                                   @RequestParam("adress") String adress,
                                   @RequestParam("type") String type,
                                   @RequestParam("capacite") Integer capacite,
                                   @RequestParam(value = "image", required = false) MultipartFile[] images)
    {
        if (name == null || adress == null || type == null) {
            throw new IllegalArgumentException("Les champs 'name', 'adress' et 'type' sont obligatoires.");
        }

        LocalEntity local = new LocalEntity();
        local.setName(name);
        local.setAdress(adress);
        local.setType(type);
        local.setCapacite(capacite);

        // Traitement des fichiers image
        List<String> imageNames = new ArrayList<>();
        if (images != null) {
            for (MultipartFile image : images) {
                try {
                    String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get("upload/").resolve(fileName);
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    imageNames.add(fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Erreur lors de l'enregistrement de l'image : " + e.getMessage());
                }
            }

            try {
                String imagesJson = new ObjectMapper().writeValueAsString(imageNames);
                local.setImage(imagesJson); // stocké sous forme JSON
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Erreur lors de la conversion des noms d’images en JSON");
            }
        }
        return localService.createLocal(local);
    }


    // Obtenir tous les locaux
    @GetMapping("/getall")
    public List<LocalEntity> getAllLocals() {
        return localService.getAllLocals();
    }

    // Obtenir un local par ID
    @GetMapping("/getbyid/{id}")
    public LocalEntity getLocalById(@PathVariable Long id) {
        return localService.getOne(id);
    }

    // Mettre à jour un local
    @PutMapping("/update/{id}")
    public LocalEntity updateLocalById(@PathVariable Long id,
                                       @RequestParam(required = false) String name,
                                       @RequestParam(required = false) String adress,
                                       @RequestParam(required = false) String type,
                                       @RequestParam(required = false) Integer capacite,
                                       @RequestParam(value = "image", required = false) MultipartFile[] images) {

        LocalEntity old = localService.getOne(id);
        if (old == null) {
            throw new EntityNotFoundException("Local with ID " + id + " not found.");
        }

        // Garde les anciennes valeurs si null
        if (name == null) name = old.getName();
        if (adress == null) adress = old.getAdress();
        if (type == null) type = old.getType();
        if (capacite == null) capacite = old.getCapacite();

        old.setName(name);
        old.setAdress(adress);
        old.setType(type);
        old.setCapacite(capacite);

        // ✅ Traitement des nouvelles images
        if (images != null && images.length > 0) {
            List<String> imageNames = new ArrayList<>();
            for (MultipartFile image : images) {
                try {
                    String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get("upload/").resolve(fileName);
                    Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    imageNames.add(fileName);
                } catch (IOException e) {
                    throw new RuntimeException("Erreur lors de l'enregistrement de l'image : " + e.getMessage());
                }
            }

            try {
                String imagesJson = new ObjectMapper().writeValueAsString(imageNames);
                old.setImage(imagesJson); // remplace les anciennes images
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Erreur lors de la conversion des noms d’images en JSON");
            }
        }

        return localService.updateLocal(old);
    }

    // Supprimer un local
    @DeleteMapping("/delete/{id}")
    public void deleteLocal(@PathVariable Long id) {
        localService.deleteLocal(id);
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename, HttpServletRequest request) {
        Resource file = storageService.loadFile(filename);
        String contentType = null;

        try {
            contentType = request.getServletContext().getMimeType(file.getFile().getAbsolutePath());
        } catch (IOException ex) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(file);
    }



    @PostMapping("/{id}/reserver")
    public ResponseEntity<?> reserverLocal(
                @PathVariable Long id,
                @RequestParam String date) {

            Optional<LocalEntity> optionalLocal = localRepository.findById(id);
            if (optionalLocal.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Local introuvable");
            }

            LocalEntity local = optionalLocal.get();
            LocalDate reservationDate = LocalDate.parse(date);

            if ("RESERVE".equals(local.getStatut()) && reservationDate.equals(local.getDateReservation())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce local est déjà réservé à cette date");
            }

            local.setDateReservation(reservationDate);
            local.setStatut("RESERVE");

            localRepository.save(local);
            return ResponseEntity.ok("Local réservé avec succès");
        }
    }



