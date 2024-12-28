import { Component } from '@angular/core';
import { PrijavaService } from '../servisi/prijava.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prijava',
  standalone: false,
  
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss'
})
export class PrijavaComponent {
    poruka: string = '';

  constructor(private prijavaService: PrijavaService, private router: Router) {}

  async prijaviSe(form: any): Promise<void> {
    const { korime, lozinka } = form;
    
    if (!korime || !lozinka) {
      this.poruka = 'Unesite korisničko ime i lozinku.';
      return;
    }
  
    try {
      const korisnik = await this.prijavaService.prijaviKorisnika(korime, lozinka);
  
      if (korisnik) {
        this.poruka = `Dobrodošli, ${korisnik.ime} ${korisnik.prezime}!`;
        this.router.navigate(['/']);
      } else {
        this.poruka = 'Neispravno korisničko ime ili lozinka.';
      }
    } catch (error) {
      if (error instanceof Error) {
        this.poruka = `Greška: ${error.message}`;
      } else {
        this.poruka = 'Prijava nije uspjela.';
      }
    }
  }
  
}
