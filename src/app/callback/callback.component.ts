import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '../services/keycloak.service';

@Component({
  selector: 'app-callback',
  template: `<p>Redirection en cours...</p>`
})
export class CallbackComponent implements OnInit {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  ngOnInit(): void {
  

  }}
