import { Component } from '@angular/core';
import { RegistracijaService } from '../servisi/registracija.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-registracija',
  standalone: false,
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.scss'],
})
export class RegistracijaComponent {
  poruka: string = '';
  ime: string = '';
  prezime: string = '';
  adresa: string = '';
  korime: string = '';
  lozinka: string = '';
  email: string = '';
  brojTelefona: string = '';
  datumRodenja: string = '';

  constructor(private registracijaService: RegistracijaService, private router: Router, private recaptchaV3Service: ReCaptchaV3Service) {}

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
      const token = await this.recaptchaV3Service.execute('registracija').toPromise();

      if (!token) {
        this.poruka = 'Neuspješna reCAPTCHA validacija.';
        return;
      }
      
      await this.registracijaService.dodajOsobuUBazu(korisnik);
      this.poruka = 'Korisnik je uspješno registriran.';
      this.router.navigate(['/prijava']);
    } catch (error) {
      this.poruka = 'Došlo je do greške prilikom registracije korisnika.';
    }
  }
}
