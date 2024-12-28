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

  constructor(private pocetnaService: PocetnaService) {}

  async ngOnInit() {
    try {
      this.korisnik = await this.pocetnaService.loadKorisnik();

    } catch (error) {
      console.error('Greška prilikom učitavanja korisnika:', error);
    }
  }

  ngAfterViewInit() {
    const statusEl = document.getElementById('status');
    const gumbZahtjev = document.getElementById('posaljiZahtjev');

    if (statusEl && gumbZahtjev) {
      if (statusEl.textContent?.trim() === 'Neaktivan') {
        gumbZahtjev.style.display = 'block';
      }

      gumbZahtjev.addEventListener('click', async () => {
        try {
          await this.pocetnaService.posaljiZahtjev();
          gumbZahtjev.style.display = 'none';
        } catch (error) {
          alert('Greška prilikom slanja zahtjeva');
        }
      });
    }
  }
}
