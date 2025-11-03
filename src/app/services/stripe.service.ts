import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private apiUrl = 'http://localhost:8070/reservations/create-checkout-session'; 

  constructor(private http: HttpClient) { }

  // Créer session Stripe pour une réservation
  createCheckoutSession(reservationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${reservationId}`, {});
  }
}
