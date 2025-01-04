import { Component } from '@angular/core';
import { PrijavaService } from '../servisi/prijava.service';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-prijava',
  standalone: false,
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss',
})
export class PrijavaComponent {
  poruka: string = '';
  zahtijevaTOTP: boolean = false;
  korime: string = '';
  tip_korisnika_id: number = 0;
  totpKod: string = '';

  constructor(
    private prijavaService: PrijavaService,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

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
        if (korisnik.test === 1) {
          this.zahtijevaTOTP = true;
          this.korime = korisnik.korime;
          this.tip_korisnika_id = korisnik.tip_korisnika_id
        } else {
          sessionStorage.setItem('korisnik', JSON.stringify(korisnik));
          this.router.navigate(['/']);
        }
      } else {
        this.poruka = 'Neispravno korisničko ime ili lozinka.';
      }
    } catch (error) {
      this.poruka = error instanceof Error ? `Greška: ${error.message}` : 'Prijava nije uspjela.';
    }
  }

  async provjeriTOTP(form: any): Promise<void> {
    try {
    const { totp } = form;

      const rezultat = await this.prijavaService.provjeriTOTP(this.korime, this.totpKod);
      
      if (rezultat!==null) {
        let korime = this.korime;
        let tip_korisnika_id = this.tip_korisnika_id;
        let sesija = {korime, tip_korisnika_id};
        console.log("sesija ",sesija);
        
        sessionStorage.setItem('korisnik', JSON.stringify(sesija));
        
        this.router.navigate(['/']);
      } else {
        this.poruka = 'Neispravan TOTP kod.';
      }
    } catch (error) {
      this.poruka = error instanceof Error ? `Greška: ${error.message}` : 'Pogreška pri provjeri TOTP koda.';
    }
  }
}
