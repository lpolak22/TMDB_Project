import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'filmovi';

  constructor(private router: Router) {}

  korisnikPrijavljen(): boolean {
    return sessionStorage.getItem('korisnik') !== null;
  }

  tipKorisnika(): number | null {
    const korisnik = sessionStorage.getItem('korisnik');
    if (korisnik) {
      const parsedKorisnik = JSON.parse(korisnik);
      return parsedKorisnik.tip_korisnika_id;
    }
    return null;
  }

  prikaziStraniceAdmin(): boolean {
    return this.tipKorisnika() === 1;
  }

  prikaziStraniceKorisnik(): boolean {
    return this.tipKorisnika() === 2;
  }

  async odjaviKorisnika(): Promise<void> {
    sessionStorage.removeItem('korisnik');
    this.router.navigate(['/prijava']);
  }
}
