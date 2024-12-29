import { Component } from '@angular/core';
import { PrijavaService } from '../servisi/prijava.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-prijava',
  standalone: false,
  
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss'
})
export class PrijavaComponent {
    poruka: string = '';

  constructor(private prijavaService: PrijavaService, private router: Router, private recaptchaV3Service: ReCaptchaV3Service) {}

  async prijaviSe(form: any): Promise<void> {
    const { korime, lozinka } = form;

    if (!korime || !lozinka) {
      this.poruka = 'Unesite korisničko ime i lozinku.';
      return;
    }

    try {
      const token = await this.recaptchaV3Service.execute('prijava').toPromise();

      if (!token) {
        this.poruka = 'Neuspješna reCAPTCHA validacija.';
        return;
      }

      const korisnik = await this.prijavaService.prijaviKorisnika(korime, lozinka);

      if (korisnik) {
        this.poruka = `Dobrodošli, ${korisnik.ime} ${korisnik.prezime}!`;
        this.router.navigate(['/']);
      } else {
        this.poruka = 'Neispravno korisničko ime ili lozinka.';
      }
    } catch (error) {
      this.poruka = error instanceof Error ? `Greška: ${error.message}` : 'Prijava nije uspjela.';
    }
  }
  
}
