// src/app/models/user.model.ts
export interface User {
    id?: number;
    username: string;
    password: string;
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    photo?: string;
    phone?: string;
  }
  