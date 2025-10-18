import { ɵExtraLocaleDataIndex } from "@angular/core";

// src/app/models/local.model.ts
export interface Local {
    id: number;
    name: string;
    adress: string;
     type: string;
  capacite: number;
  images?: string[];
   dateReservation:Date;
  statut: string;
  }
