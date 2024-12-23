import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DodavanjeService {
  private restServis: string = environment.restServis;

  constructor() {}

  /**
   * @param ime
   * @param stranica
   * @returns
   */
  async pretraziOsobePoImenu(ime: string, stranica: number): Promise<any> {
    let parametar = `${ime}`;

    try {
      const response = await fetch(`${this.restServis}app/dodavanje?ime=${parametar}&stranica=${stranica}`, {
        headers: { 'Content-type': 'application/json' },
      });

      let data = await response.json();

      if (response.status === 200) {
        return {
          totalPages: data.ukupnoStranica,
          totalResults: data.ukupnoOsoba,
          osobe: data.osobe,
          currentPage: data.trenutnaStranica,
        };
      } else {
        throw new Error('Došlo je do pogreške prilikom dohvata podataka');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Zao nam je, doslo je do pogreske prilikom pretrage osoba');
    }
  }

  async dohvatiFilmoveOsobe(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.restServis}osoba/${id}/film`, {
        headers: { 'Content-type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Greška prilikom dohvata filmova osobe.');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Zao nam je, doslo je do pogreske prilikom dohvata filmova osobe.');
    }
  }
  
  async dodajOsobuUBazu(podaciOsobe: any): Promise<void> {
    try {
        const response = await fetch(`${this.restServis}osoba`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(podaciOsobe),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.greska || 'Neuspješno dodavanje osobe.');
        }
        console.log(podaciOsobe);
        
        const filmovi = await this.dohvatiFilmoveOsobe(podaciOsobe.id);
        for (const film of filmovi) {
            await this.dodajFilmUBazu(film);
            await this.poveziOsobuIFilm(podaciOsobe.id, film.id);
        }
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

  
  async dodajFilmUBazu(podaciFilma: any): Promise<void> {
    try {
      const response = await fetch(`${this.restServis}film`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podaciFilma),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.greska || 'Neuspješno dodavanje filma.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async poveziOsobuIFilm(osobaId: number, filmId: number): Promise<void> {
    try {
      const response = await fetch(`${this.restServis}osoba/${osobaId}/film`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.greska || 'Neuspješno povezivanje osobe s filmom.');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
}
