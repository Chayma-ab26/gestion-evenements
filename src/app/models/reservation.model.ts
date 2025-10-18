// src/app/models/reservation.model.ts
export interface Reservation {
    id?: number;
    eventId: number;
    nbParticipants: number;
    reservationDate?: string; // ISO format
    status?: string;
    userKeycloakId?: string;
}
  