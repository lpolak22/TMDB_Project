import { Injectable } from '@angular/core';
import { CanActivate , Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const korisnik = JSON.parse(sessionStorage.getItem('korisnik') || '{}');
    if (korisnik && (korisnik.tip_korisnika_id === 1 || korisnik.tip_korisnika_id === 2)) {
      return true;
    }

    this.router.navigate(['/prijava']);
    return false;
  }
}
