import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistracijaService {
  restServis: string = environment.restServis;

  constructor() {}

  async dodajOsobuUBazu(podaciOsobe: any): Promise<void> {
    try {
      const response = await fetch(`${this.restServis}app/registracija`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podaciOsobe),
      });

      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(pogreskaInfo.greska || 'Neuspješno dodavanje korisnika.');
      }

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
