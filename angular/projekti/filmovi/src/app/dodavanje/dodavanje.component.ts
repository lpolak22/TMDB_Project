import { Component } from '@angular/core';
import { DodavanjeService } from '../servisi/dodavanje.service';

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

  // obrisiOsobu(osoba: any) {
  //   console.log('Obriši osobu:', osoba);
  // }

  async dodajOsobu(osoba: any) {
    try {
        // Dodaj osobu u bazu
        await this.dodavanjeService.dodajOsobuUBazu(osoba);

        alert('Osoba i njeni filmovi uspješno dodani.');
    } catch (error: any) {
        alert(error.message || 'Greška prilikom dodavanja osobe.');
    }
}

  
}
