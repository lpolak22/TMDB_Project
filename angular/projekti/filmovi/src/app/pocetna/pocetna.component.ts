import { Component } from '@angular/core';
import { PocetnaService } from '../servisi/pocetna.service';

@Component({
  selector: 'app-pocetna',
  standalone: false,
  
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss'
})
export class PocetnaComponent {
  korisnik: any = {};
  prikaziGumb: boolean = false;


  constructor(private pocetnaService: PocetnaService) {}

  async ngOnInit() {
    try {
      this.korisnik = await this.pocetnaService.loadKorisnik();
      this.prikaziGumb = this.korisnik.status === 0 || this.korisnik.status === null;
    } catch (error) {
      console.error('Greška prilikom učitavanja korisnika:', error);
    }
  }

  async posaljiZahtjev() {
    try {
      await this.pocetnaService.posaljiZahtjev(this.korisnik.korime);
      this.prikaziGumb = false;
      alert('Zahtjev uspješno poslan!');
    } catch (error) {
      alert('Greška prilikom slanja zahtjeva');
    }
  }
}
