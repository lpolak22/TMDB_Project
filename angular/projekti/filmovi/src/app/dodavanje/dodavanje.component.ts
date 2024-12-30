import { Component } from '@angular/core';
import { DodavanjeService } from '../servisi/dodavanje.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dodavanje',
  standalone: false,
  templateUrl: './dodavanje.component.html',
  styleUrls: ['./dodavanje.component.scss'],
})
export class DodavanjeComponent {
  ime: string = '';
  osobe: any[] = [];
  porukaGreske: string | null = null;
  trenutnaStranica: number = 1;
  ukupnoStranica: number = 1;

  constructor(private dodavanjeService: DodavanjeService) {}

  async pretraziOsobe() {
    if (!this.ime.trim()) {
      this.porukaGreske = 'Unesite pojam za pretragu.';
      return;
    }
    try {
      this.porukaGreske = null;
      const rezultat = await this.dodavanjeService.pretraziOsobePoImenu(this.ime, this.trenutnaStranica);

      for (const osoba of rezultat.osobe) {
        osoba.dodana = await this.dodavanjeService.provjeriOsobuUBazi(osoba.id);
      }

      this.osobe = rezultat.osobe;
      this.ukupnoStranica = rezultat.totalPages;
    } catch (error) {
      this.porukaGreske = 'Greška prilikom pretrage osoba.';
      console.error(error);
    }
  }

  sljedecaStranica() {
    if (this.trenutnaStranica < this.ukupnoStranica) {
      this.trenutnaStranica++;
      this.pretraziOsobe();
    }
  }

  prethodnaStranica() {
    if (this.trenutnaStranica > 1) {
      this.trenutnaStranica--;
      this.pretraziOsobe();
    }
  }

  idiNaPrvuStranicu() {
    this.trenutnaStranica = 1;
    this.pretraziOsobe();
  }

  idiNaPosljednjuStranicu() {
    this.trenutnaStranica = this.ukupnoStranica;
    this.pretraziOsobe();
  }

  async dodajOsobu(osoba: any) {
    try {
      await this.dodavanjeService.dodajOsobuUBazu(osoba);
      osoba.dodana = true;
      this.osobe = [...this.osobe];
    } catch (error: any) {
      alert(error.message || 'Greška prilikom dodavanja osobe.');
    }
  }

  async obrisiOsobu(osoba: any) {
    try {
      osoba.dodana = false;
      await this.dodavanjeService.obrisiOsobu(osoba.id);

      this.osobe = [...this.osobe];
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Greška prilikom brisanja osobe.');
    }
  }

  pretvoriSliku(slika: string): string {
    if (!slika) {
      return '../../assets/default-image.png'; 
    }

    if (slika.startsWith('http')) {
      return slika;
    }

    return `${environment.slikaOsobePutanja}${slika}`;
  }
}
