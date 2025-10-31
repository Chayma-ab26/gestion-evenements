import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  private apiUrl = 'http://localhost:8080'; // ton backend

  constructor(private http: HttpClient) { }

  // Créer session Stripe pour une réservation
  createCheckoutSession(reservationId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-checkout-session/${reservationId}`, {});
  }
}
