package com.example.reservationService.controllers;

import com.example.eventService.entities.EventDTO;
import com.example.eventService.entities.EventEntity;
import com.example.reservationService.clients.EventClient;
import com.example.reservationService.clients.UserClient;
import com.example.reservationService.entities.ReservationDTO;
import com.example.reservationService.entities.ReservationEntity;
import com.example.reservationService.services.ReservationService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyEditorSupport;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/reservations")
public class ReservationController {
    @Value("${stripe.secret.key}")
    private String stripeApiKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;


    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserClient userClient;
    @Autowired
    private EventClient eventClient;

    /**
     * Crée une réservation pour l'utilisateur connecté
     */
    @PostMapping("/create")
    public ResponseEntity<?> createReservation(
            @RequestBody ReservationDTO reservationDTO,
            @RequestHeader("Authorization") String bearerToken) {

        try {
            // 1️⃣ Récupération de l'utilisateur connecté via UserClient
            ResponseEntity<Map<String, Object>> userResponse = userClient.getCurrentUser(bearerToken);
            if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Impossible de récupérer l'utilisateur connecté"));
            }

            Map<String, Object> userMap = userResponse.getBody();
            Long userId = Long.valueOf(userMap.get("id").toString());
            String keycloakId = userMap.get("keycloakid").toString();

            // 2️⃣ Création de la réservation
            ReservationEntity reservation = new ReservationEntity();
            reservation.setEventId(reservationDTO.getEventId());
            reservation.setNbParticipants(reservationDTO.getNbParticipants());
            reservation.setReservationDate(LocalDateTime.now());
            reservation.setStatus("pending");
            reservation.setUserId(userId);
            reservation.setUserKeycloakId(keycloakId);

            ReservationEntity saved = reservationService.createReservation(reservation);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la création de la réservation"));
        }
    }

    /**
     * Récupère toutes les réservations
     */
    @GetMapping("/getall")
    public List<ReservationEntity> getAllReservations() {
        return reservationService.getAllReservations();
    }


    @GetMapping("/user/{keycloakId}")
    public ResponseEntity<?> getReservationsByUser(@PathVariable String keycloakId) {
        try {
            List<ReservationEntity> reservations = reservationService.getReservationsByKeycloakId(keycloakId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération des réservations"));
        }
    }

    /**
     * Récupère les réservations de l'utilisateur connecté
     */
    @GetMapping("/my-reservations")
    public ResponseEntity<?> getMyReservations(@RequestHeader("Authorization") String bearerToken) {
        try {
            // Récupération de l'utilisateur connecté
            ResponseEntity<Map<String, Object>> userResponse = userClient.getCurrentUser(bearerToken);
            if (!userResponse.getStatusCode().is2xxSuccessful() || userResponse.getBody() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Impossible de récupérer l'utilisateur connecté"));
            }

            Map<String, Object> userMap = userResponse.getBody();
            String keycloakId = userMap.get("keycloakid").toString();

            // Récupération des réservations
            List<ReservationEntity> reservations = reservationService.getReservationsByKeycloakId(keycloakId);
            return ResponseEntity.ok(reservations);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la récupération des réservations"));
        }
    }



    @PostMapping ("/create-checkout-session/{reservationId}")
    public ResponseEntity<?> createCheckoutSession(@PathVariable Long reservationId) {
        try {
            ReservationEntity reservation = reservationService.getReservationById(reservationId);
            if (reservation == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Réservation non trouvée"));
            }
            EventDTO event = eventClient.getEventById(reservation.getEventId());
            if (event == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Événement non trouvé"));
            }

            long priceInCents = (long) (event.getPrix() * 100);

            Stripe.apiKey = stripeApiKey;

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setUnitAmount(priceInCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Paiement réservation #" + reservationId)
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .setQuantity(1L)
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            return ResponseEntity.ok(Map.of("id", session.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de la création de la session Stripe"));
        }
    }
    /**
     * Webhook pour confirmer le paiement (à appeler par Stripe)
     */
    @PostMapping("/webhook/stripe")
    public ResponseEntity<?> handleStripeWebhook(@RequestBody String payload,
                                                 @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // Implémentez la vérification de la signature Stripe
            // et la mise à jour du statut de la réservation

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    /**
     * Gestion du format LocalDateTime
     */
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(LocalDateTime.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                setValue(LocalDateTime.parse(text, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")));
            }
        });
    }
}
