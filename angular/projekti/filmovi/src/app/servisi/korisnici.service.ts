import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KorisniciService {
  restServis: string = environment.restServis;
  korisnici: any[] = [];
  odabranKorisnik: any[] = [];

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
  
  async obrisiKorisnikaWeb(korime: string) {
    let korimePrijavljen = sessionStorage.getItem(korime);
    try {
      let response = await fetch(`${this.restServis}app/korisnici/${korime}`, {
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

  async dajPristup(korime: string) {
    try {
      const response = await fetch(`${this.restServis}app/korisniciPristup/${korime}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 1 }),
      });
  
      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(pogreskaInfo.greska || 'Davanje pristupa nije uspjelo.');
      }
      await this.dodajKorisnika(this.odabranKorisnik)
      
    } catch (error) {
      console.error('Greška prilikom davanja pristupa:', error);
      throw error;
    }
  }

  async dodajKorisnika(korisnik: any) {
    try {
      const response = await fetch(`${this.restServis}korisnici`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ korisnik }),
      });

      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(pogreskaInfo.greska || 'Dodavanje korisnika nije uspjelo');
      }
    } catch (error) {
      console.error('Greška prilikom dodavanja korisnika:', error);
      throw error;
    }
  }

  spremiKorisnika(korisnik: any) {
    this.odabranKorisnik = korisnik;
  }  

  async zabraniPristup(korime: string) {
    try {
        const response = await fetch(`${this.restServis}app/korisniciPristup/${korime}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 0 }),
        });

        if (!response.ok) {
            const pogreskaInfo = await response.json();
            throw new Error(pogreskaInfo.greska || 'Zabrana pristupa nije uspjela.');
        }
        await this.obrisiKorisnika(korime);
    } catch (error) {
        console.error('Greška prilikom zabrane pristupa:', error);
        throw error;
    }
  }
  
}
