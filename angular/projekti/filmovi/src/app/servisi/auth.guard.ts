import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const korisnik = await this.korisnikSesija();
  
    if (state.url === '' || state.url === '/') {
      if (korisnik) {
        return true;
      }
      this.router.navigate(['/prijava']);
      return false;
    }
  
    if (['/prijava', '/registracija'].includes(state.url)) {
      if (!korisnik) {
        return true;
      }
      this.router.navigate(['/']);
      return false;
    }
  
    const tipKorisnika = korisnik?.tip_korisnika_id;
    if (tipKorisnika === 1 && ['/korisnici', '/dodavanje', '/filtriranje-filmova', '/dvorazinska'].includes(state.url)) {
      return true;
    } else if (tipKorisnika === 2 && ['/', '/osobe', '/filtriranje-filmova', '/dvorazinska',`/detalji/${route.params['id']}`].includes(state.url)) {
      return true;
    }
  
    this.router.navigate(['/']);
    return false;
  }
  

  private async korisnikSesija(): Promise<any> {
    return new Promise((resolve) => {
      const korisnik = sessionStorage.getItem('korisnik');
      resolve(korisnik ? JSON.parse(korisnik) : null);
    });
  }
}
