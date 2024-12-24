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

  // async obrisiOsobu(osoba: any) {
  //   if (!confirm(`Jeste li sigurni da želite obrisati osobu ${osoba.ime_prezime}?`)) {
  //     return;
  //   }
  
  //   try {
  //     await this.dodavanjeService.obrisiOsobu(osoba.id);
  //     this.osobe = this.osobe.filter((o) => o.id !== osoba.id);
  //   } catch (error: any) {
  //     alert(error.message || 'Greška prilikom brisanja osobe.');
  //   }
  // }
  

  async dodajOsobu(osoba: any) {
    try {
      await this.dodavanjeService.dodajOsobuUBazu(osoba);
      // Ažuriranje svojstva 'dodana' i obavijest Angularu o promjeni
      osoba.dodana = true;
      this.osobe = [...this.osobe]; // Kreiranje nove reference za osvježavanje prikaza
    } catch (error: any) {
      alert(error.message || 'Greška prilikom dodavanja osobe.');
    }
  }
  
  async obrisiOsobu(osoba: any) {
    if (!confirm(`Jeste li sigurni da želite obrisati osobu ${osoba.ime_prezime}?`)) {
      return;
    }
    try {
      await this.dodavanjeService.obrisiOsobu(osoba.id);
      // Ažuriranje svojstva 'dodana' i obavijest Angularu o promjeni
      osoba.dodana = false;
      this.osobe = [...this.osobe]; // Kreiranje nove reference za osvježavanje prikaza
    } catch (error: any) {
      alert(error.message || 'Greška prilikom brisanja osobe.');
    }
  }
  
  
  isOsobaDodana(osoba: any): boolean {
    return osoba.dodana === true; // Provjera statusa osobe
  }
  

  
}
