import { Component } from '@angular/core';
import { RegistracijaService } from '../servisi/registracija.service';  // Importirajte servis

@Component({
  selector: 'app-registracija',
  standalone: false,
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss'],
})
export class RegistracijaComponent {
  poruka: string = ''; // Poruka za korisnika
  ime: string = '';
  prezime: string = '';
  adresa: string = '';
  korime: string = '';
  lozinka: string = '';
  email: string = '';
  brojTelefona: string = '';
  datumRodenja: string = '';

  constructor(private registracijaService: RegistracijaService) {}

  async registriraj() {
    const korisnik = {
      ime: this.ime,
      prezime: this.prezime,
      adresa: this.adresa,
      korime: this.korime,
      lozinka: this.lozinka,
      email: this.email,
      broj_telefona: this.brojTelefona,
      datum_rodenja: this.datumRodenja
    };

    try {
      // Pozivanje servisa za dodavanje korisnika u bazu
      await this.registracijaService.dodajOsobuUBazu(korisnik);
      this.poruka = 'Korisnik je uspješno registriran.';
    } catch (error) {
      this.poruka = 'Došlo je do greške prilikom registracije korisnika.';
    }
  }
}
