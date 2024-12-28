import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PocetnaService {
  restServis: string = environment.restServis;
  korisnik: any;
  
  constructor() {}
  
  async loadKorisnik(): Promise<any> {
    try {
      const response = await fetch(`${this.restServis}app/podaciPocetna`);
      if (response.status === 200) {        
        return await response.json();

      } else {
        throw new Error('Neuspješno dohvaćanje podataka korisnika.');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Greška prilikom dohvaćanja podataka.');
    }
  }

  async posaljiZahtjev(): Promise<any> {
    try {
      const response = await fetch(`${this.restServis}app/zahtjev`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poruka: 'Zahtjev za korištenje servisa' }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        const error = await response.json();
        throw new Error(error.greska || 'Neuspješna prijava');
      }
    } catch (error) {
      console.error('Greška kod slanja zahtjeva:', error);
      throw error;
    }
  }
}
