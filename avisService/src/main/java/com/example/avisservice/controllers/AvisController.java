package com.example.avisservice.controllers;

import com.example.avisservice.clients.EventClient;
import com.example.avisservice.clients.UserClient;
import com.example.avisservice.entities.AvisEntity;
import com.example.avisservice.services.AvisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/avis")
public class AvisController {

    @Autowired
    private AvisService avisService;

    @Autowired
    private EventClient eventClient;

    @Autowired
    private UserClient userClient;

    @PostMapping("/create")
    public ResponseEntity<?> createAvis(@RequestBody AvisEntity avis) {
        try {
            // Optionnel : laisser userId null si tu ne veux pas l'enregistrer
            // avis.setUserId(null);
            // avis.setUserKeycloakId(null);

            AvisEntity savedAvis = avisService.createAvis(avis);
            return ResponseEntity.ok(savedAvis);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Erreur lors de la création de l'avis : " + e.getMessage()));
        }
    }

    @GetMapping("/getall")
    public List<AvisEntity> getAllAvis() {
        return avisService.getAll();
    }

    @GetMapping("/event/{eventId}")
    public List<AvisEntity> getAvisByEvent(@PathVariable Long eventId) {
        return avisService.getAll().stream()
                .filter(a -> a.getEventId().equals(eventId))
                .toList();
    }
}
