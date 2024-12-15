import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OsobeService {
  restServis: string = environment.restServis;
  osobe: any[] = [];
  currentPage: number = 1;
  
  constructor() {}

  async loadOsobe(stranica: number) {
    let parametri = `?stranica=${stranica}`;
    try {
      let response = await fetch(`${this.restServis}osoba${parametri}`);
      if (response.status === 200) {
        let data = await response.json();
        this.osobe = data;
        return this.osobe;
      } else {
        throw new Error('Neuspjesno dohvacanje');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Neuspjesno dohvacanje');
    }
  }

  getOsobe(): any[] {
    return this.osobe;
  }
}
