package com.example.avisservice.controllers;
import com.example.avisservice.clients.EventClient;
import com.example.avisservice.clients.UserClient;
import com.example.avisservice.entities.AvisEntity;
import com.example.avisservice.services.AvisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/avis")
public class AvisController {

    @Autowired
    private AvisService avisService;
    @Autowired
    private UserClient userClient;

    @Autowired
    private EventClient eventClient;

    @PostMapping("/create")
    public ResponseEntity<?> createAvis(
            @RequestParam Long userId,
            @RequestParam Long eventId,
            @RequestParam int note,
            @RequestParam(required = false) String commentaire) {

        // Appel Feign pour récupérer l'utilisateur
        Object user = userClient.getUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("Utilisateur non trouvé");
        }

        // Appel Feign pour récupérer l'événement
        Object event = eventClient.getEventById(eventId);
        if (event == null) {
            return ResponseEntity.badRequest().body("Événement non trouvé");
        }

        AvisEntity avis = new AvisEntity();
        avis.setUserId(userId);
        avis.setEventId(eventId);
        avis.setNote(note);
        avis.setCommentaire(commentaire);

        return ResponseEntity.ok(avisService.createAvis(avis));
    }

    @GetMapping("/getall")
    public List<AvisEntity> getallavis() {
        return avisService.getAll();
    }


    }