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

    /**
     * Crée un avis pour l'utilisateur connecté
     */
    @PostMapping("/create")
    public ResponseEntity<?> createAvis(
            @RequestBody AvisEntity avis,
            @RequestHeader(value = "Authorization", required = false) String bearerToken) {

        try {
            // 1️⃣ Récupération de l'utilisateur connecté depuis UserClient
            if (bearerToken == null || bearerToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Aucun token fourni"));
            }

            ResponseEntity<Map<String, Object>> userResponse = userClient.getCurrentUser(bearerToken);
            if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Impossible de récupérer l'utilisateur connecté"));
            }

            Map<String, Object> userMap = userResponse.getBody();
            Long userId = Long.valueOf(userMap.get("id").toString());
            String keycloakId = userMap.get("keycloakid").toString();

            // 2️⃣ Vérifier que l'événement existe
            Object event = eventClient.getEventById(avis.getEventId());
            if (event == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Événement non trouvé"));
            }

            // 3️⃣ Affecter les infos utilisateur et sauvegarder l'avis
            avis.setUserId(userId);
            avis.setUserKeycloakId(keycloakId);

            AvisEntity savedAvis = avisService.createAvis(avis);
            return ResponseEntity.ok(savedAvis);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la création de l'avis : " + e.getMessage()));
        }
    }

    /**
     * Récupère tous les avis
     */
    @GetMapping("/getall")
    public List<AvisEntity> getAllAvis() {
        return avisService.getAll();
    }

    /**
     * Récupère les avis d'un événement
     */
    @GetMapping("/event/{eventId}")
    public List<AvisEntity> getAvisByEvent(@PathVariable Long eventId) {
        return avisService.getAll().stream()
                .filter(a -> a.getEventId().equals(eventId))
                .toList();
    }
}
