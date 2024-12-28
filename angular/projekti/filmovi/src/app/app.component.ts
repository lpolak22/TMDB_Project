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
    let korisnik = sessionStorage.getItem('korisnik');
    return korisnik !== null;
  }

  async odjaviKorisnika(): Promise<void> {
    sessionStorage.removeItem('korisnik');
    this.router.navigate(['/prijava']);
  }
}
