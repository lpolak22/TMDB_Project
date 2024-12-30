import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetaljiService {
  private restServis: string = environment.restServis;
  filmovi: any[] = [];
  osoba: any = null;
  slikeOsobe: Array<string> = [];

  constructor() {}

  prebaciSliku(slika: string): string {
    if (!slika) {
      return '../../assets/default-image.jpg';
    }

    if (slika.startsWith('http')) {
      return slika;
    }

    return `${environment.slikaOsobePutanja}${slika}`;
  }

  async dohvatiPovezaneFilmove(id: number) {
    try {
      const response = await fetch(`${this.restServis}osoba/${id}/film`);
      if (response.status === 200) {
        const data = await response.json();
  
        const films = data.map((film: any) => ({
          jezik: film.jezik,
          originalni_naslov: film.originalni_naslov,
          naslov: film.naslov,
          popularnost: film.popularnost,
          slikica_postera: this.prebaciSliku(film.slikica_postera),
          datum_izdavanja: film.datum_izdavanja,
          lik: film.lik,
        }));
        
        this.filmovi = films;
        return this.filmovi;
      } else {
        throw new Error('Neuspješno dohvaćanje povezanih filmova');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Greška pri dohvaćanju povezanih filmova');
    }
  }
  
  
  // async loadSlikeOsobe(id: string) {
  //   try {
  //     const response = await fetch(`${environment.restServis}app/detalji/${id}`, {
  //       headers: {
  //         Accept: 'application/json',
  //       },
  //     });
  
  //     if (response.status === 200) {
  //       const data = await response.json();
  //       const slikePutanje = data.slike.slice(0, 20);
  //       this.slikeOsobe = slikePutanje.map((slika: string) => this.prebaciSliku(slika));
  
  //       for (const slika of slikePutanje) {
  //         await this.posaljiSlikuUBazu(id, slika);
  //       }
  //     } else {
  //       throw new Error('Slike osobe nisu dostupne');
  //     }
  //   } catch (error) {
  //     console.error('Greška pri dohvaćanju slika osobe:', error);
  //   }
  // }
  
  // private async posaljiSlikuUBazu(osobaId: string, slikaPutanja: string) {
    
  //   try {
  //     const response = await fetch(`${environment.restServis}app/detaljiSlike`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         slika_putanja: slikaPutanja,
  //         osoba_id: osobaId,
  //       }),
  //     });
      
  //     if (!response.ok) {
  //       console.error('Greška pri dodavanju slike u bazu:', await response.text());
  //     }
  //   } catch (error) {
  //     console.error('Greška pri slanju slike u bazu:', error);
  //   }
  // }
  async loadOsobaDetalji(id: string) {
    try {
      const response = await fetch(`${environment.restServis}osoba/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        this.osoba = {
          ...data,
          slika: this.prebaciSliku(data.slika),
        };
      } else {
        throw new Error('Podaci osobe nisu dostupni');
      }
    } catch (error) {
      console.error(error);
    }
  }
  async loadSlikeGalerija(id: string) {
    try {
      const response = await fetch(`${environment.restServis}app/detaljiSlike${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.status === 200) {
        const slike = await response.json();
        
        this.slikeOsobe = slike.map((item: { slika_putanja: string }) => this.prebaciSliku(item.slika_putanja));
        
        this.osoba = {
          ...slike,
          slika: this.prebaciSliku(slike.slika),
        };
        
      } else {
        throw new Error('Podaci osobe nisu dostupni');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
