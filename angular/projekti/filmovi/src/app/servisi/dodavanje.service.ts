import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DodavanjeService {
  private restServis: string = environment.restServis;

  constructor() {}

  /**
   * Pretraga osoba po imenu i stranici.
   * @param ime
   * @param stranica
   * @returns
   */
  async pretraziOsobePoImenu(ime: string, stranica: number): Promise<any> {
    const parametri = `${ime}`;

    try {
      const response = await fetch(`${this.restServis}app/dodavanje?ime=${parametri}&stranica=${stranica}`, {
        headers: { 'Content-type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          totalPages: data.ukupnoStranica,
          totalResults: data.ukupnoOsoba,
          osobe: data.osobe,
          currentPage: data.trenutnaStranica,
        };
      } else {
        throw new Error('Neuspješno dohvaćanje podataka.');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Greška prilikom pretrage osoba.');
    }
  }
}
