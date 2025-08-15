// src/app/models/reservation.model.ts
export interface Reservation {
    id?: number;
    reservationDate: string; // Use ISO format: 'yyyy-MM-ddTHH:mm:ss'
    status?: string;
    userId: number;
    eventId: number;
  }
  