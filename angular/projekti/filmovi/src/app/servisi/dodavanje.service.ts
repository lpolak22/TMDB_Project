import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DodavanjeService {
  private restServis: string = environment.restServis;
  slikeOsobe: Array<string> = [];


  constructor() {}

  /**
   * @param ime
   * @param stranica
   * @returns
   */
  async pretraziOsobePoImenu(ime: string, stranica: number): Promise<any> {
    const parametar = `${ime}`;
    try {
      const response = await fetch(`${this.restServis}app/dodavanje?ime=${parametar}&stranica=${stranica}`, {
        headers: { 'Content-type': 'application/json' },
      });

      const data = await response.json();

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
      throw new Error('Žao nam je, došlo je do pogreške prilikom pretrage osoba.');
    }
  }

  /**
   * @param id
   * @returns
   */
  async dohvatiFilmoveOsobe(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.restServis}app/dodavanje/${id}/filmovi`, {
        headers: { 'Content-type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Greška prilikom dohvata filmova osobe.');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Žao nam je, došlo je do pogreške prilikom dohvata filmova osobe.');
    }
  }

  /**
   * @param podaciOsobe
   */
  async dodajOsobuUBazu(podaciOsobe: any): Promise<void> {
    try {
      const response = await fetch(`${this.restServis}osoba`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podaciOsobe),
      });
  
      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(pogreskaInfo.greska || 'Neuspješno dodavanje osobe.');
      }
  
      const podaciFilmova = await this.dohvatiFilmoveOsobe(podaciOsobe.id);  
      const filmovi = podaciFilmova.filmovi;
  
      if (!Array.isArray(filmovi)) {
        throw new Error('Rezultat funkcije dohvatiFilmoveOsobe nije niz filmova.');
      }
  
      await this.dodajFilmUBazu(filmovi);
  
      await this.poveziOsobuIFilm(podaciOsobe.id, filmovi);

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  /**
   * @param podaciFilmova
   */
  async dodajFilmUBazu(podaciFilmova: any[]): Promise<void> {
    try {
      if (!Array.isArray(podaciFilmova)) {
        throw new Error('Očekivan je niz podataka o filmovima, ali je dobiven drugačiji format.');
      }
  
      for (const film of podaciFilmova) {
        try {
          const response = await fetch(`${this.restServis}film`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(film),
          });
  
          if (!response.ok) {
            const pogreskaInfo = await response.json();
            console.warn(`Film s ID-jem ${film.id} nije dodan: ${pogreskaInfo.greska || 'Nepoznata greška'}`);
            continue;
          }
        } catch (filmError) {
          console.warn(`Greška prilikom dodavanja filma s ID-jem ${film.id}:`, filmError);
          continue;
        }
      }
    } catch (error) {
      console.error('Greška prilikom dodavanja filmova u bazu:', error);
      throw error;
    }
  }
  
  

  /**
   * @param osobaId
   * @param filmId
   */
  /**
 * @param osobaId
 * @param filmovi
 */
async poveziOsobuIFilm(osobaId: number, filmovi: any[]): Promise<void> {
  try {
    const response = await fetch(`${this.restServis}osoba/${osobaId}/film`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filmovi),
    });

    if (!response.ok) {
      const pogreskaInfo = await response.json();
      throw new Error(pogreskaInfo.greska || 'Neuspješno povezivanje osobe s filmovima.');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async obrisiOsobu(id: number): Promise<void> {
  try {
    const dohvaceniFilmovi = await fetch(`${this.restServis}osoba/${id}/film`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!dohvaceniFilmovi.ok) {
      throw new Error('Neuspješno dohvaćanje filmova osobe.');
    }

    const filmovi = await dohvaceniFilmovi.json();

    let response = await fetch(`${this.restServis}osoba/${id}/film`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const pogreskaInfo = await response.json();
      throw new Error(pogreskaInfo.greska || 'brisanje veze osobe na filmove nije uspjelo');
    }

    response = await fetch(`${this.restServis}app/obrisiSlike${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const pogreskaInfo = await response.json();
      throw new Error(pogreskaInfo.greska || 'brisanje slika nije uspjelo');
    }

    response = await fetch(`${this.restServis}osoba/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const pogreskaInfo = await response.json();
      throw new Error(pogreskaInfo.greska || 'brisanje osobe nije uspjelo');
    }

    if (Array.isArray(filmovi)) {
      for (const film of filmovi) {
        const obrisiFilm = await fetch(`${this.restServis}film/${film.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
  } catch (error) {
    console.error('Greška prilikom brisanja osobe:', error);
    throw error;
  }
}

  async provjeriOsobuUBazi(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${this.restServis}osoba/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error(`Greška prilikom provjere osobe s ID-jem ${id}:`, error);
    return false;
  }
}

async loadSlikeOsobe(id: number) {
  try {
    const response = await fetch(`${environment.restServis}app/detalji/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      
      const slikePutanje = data.slike.slice(0, 20);
      this.slikeOsobe = data;

      for (const slika of slikePutanje) {
        
        await this.posaljiSlikuUBazu(id, slika);
      }
    } else {
      throw new Error('Slike osobe nisu dostupne');
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju slika osobe:', error);
  }
}

private async posaljiSlikuUBazu(osobaId: number, slikaPutanja: string) {
  
  try {
    const response = await fetch(`${environment.restServis}app/detaljiSlike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slika_putanja: slikaPutanja,
        osoba_id: osobaId,
      }),
    });
    
    if (!response.ok) {
      console.error('Greška pri dodavanju slike u bazu:', await response.text());
    }
  } catch (error) {
    console.error('Greška pri slanju slike u bazu:', error);
  }
}
  
}
