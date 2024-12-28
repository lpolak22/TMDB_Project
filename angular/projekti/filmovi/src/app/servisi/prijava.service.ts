import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrijavaService {
  restServis: string = environment.restServis;

  constructor() {}

  async prijaviKorisnika(korime: string, lozinka: string): Promise<any> {
    try {
      const response = await fetch(`${this.restServis}app/prijava`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ korime, lozinka }),
      });

      if (response.ok) {
        const korisnik = await response.json();
        sessionStorage.setItem('korisnik', JSON.stringify(korisnik));
        return korisnik;

      } else {
        const error = await response.json();
        throw new Error(error.greska || 'Neuspješna prijava');
      }
    } catch (error) {
      console.error('Greška tijekom prijave:', error);
      throw error;
    }
  }

}
