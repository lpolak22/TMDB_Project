import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KorisniciService {
  restServis: string = environment.restServis;
  korisnici: any[] = [];

  constructor() { }

  async loadKorisnici() {
    let sesija = sessionStorage.getItem('korisnik');
    if (sesija) {
      let korisnik = JSON.parse(sesija);
    }
    
    try {
      let response = await fetch(`${this.restServis}app/podaciKorisnici`);
      
      if (response.status === 200) {
        let data = await response.json();
        this.korisnici = data;
        return this.korisnici;
      } else {
        throw new Error('Neuspjesno dohvacanje korisnika');
      }
    } catch (error) {
      throw new Error('Neuspjesno dohvacanje korisnika');
    }
  }

  async obrisiKorisnika(korime: string) {
    let korimePrijavljen = sessionStorage.getItem(korime);
    try {
      let response = await fetch(`${this.restServis}korisnici/${korime}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(pogreskaInfo.greska || 'Brisanje korisnika nije uspjelo');
      }
      
    } catch (error) {
      console.error('Greška prilikom brisanja korisnika:', error);
      throw error;
    }
  }
    
  
}
