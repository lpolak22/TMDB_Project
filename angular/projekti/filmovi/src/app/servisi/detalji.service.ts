import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetaljiService {
  private restServis: string = environment.restServis;
  filmovi: any[] = [];

  constructor() {}

  async dohvatiSlikeOsobe(id: number) {
    try {
      const response = await fetch(`${this.restServis}osoba/${id}/slike`);
      if (response.status === 200) {
        const data = await response.json();
        return data.slike.map((slika: { file_path: string }) => slika.file_path);
      } else {
        throw new Error('Neuspješno dohvaćanje slika');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Greška pri dohvaćanju slika');
    }
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
  
  prebaciSliku(poster: string): string {
    if (!poster) {
      return '../../assets/no_photo.jpg';
    }
  
    if (poster.startsWith('http')) {
      return poster;
    }
    else
    return `${environment.posteriPutanja}${poster}`;
  }
  
}
