import { Component, OnInit } from '@angular/core';
import { KorisniciService } from '../servisi/korisnici.service';
import { StatusService } from '../servisi/status.service';

@Component({
  selector: 'app-korisnici',
  standalone: false,
  templateUrl: './korisnici.component.html',
  styleUrls: ['./korisnici.component.scss']
})
export class KorisniciComponent implements OnInit {
  korisnici: any[] = [];
  errorMessage: string = '';
  prijavljeniKorisnikKorime: string = '';

  constructor(private korisniciService: KorisniciService, private statusService: StatusService) {}

  ngOnInit() {
    this.loadPrijavljeniKorisnik();
    this.loadKorisnici();
  }

  loadPrijavljeniKorisnik() {
    const sesija = sessionStorage.getItem('korisnik');
    if (sesija) {
      const korisnik = JSON.parse(sesija);
      this.prijavljeniKorisnikKorime = korisnik.korime;
    }
  }

  async loadKorisnici() {
    try {
      this.korisnici = await this.korisniciService.loadKorisnici();
    } catch (error) {
      this.errorMessage = 'Greška pri učitavanju podataka o korisnicima.';
    }
  }

  async obrisiKorisnika(korime: string) {
    try {
      await this.korisniciService.obrisiKorisnikaWeb(korime);
      this.korisnici = this.korisnici.filter(korisnik => korisnik.korime !== korime);
    } catch (error) {
      this.errorMessage = 'Greška prilikom brisanja korisnika.';
    }
  }

  async dajPristup(korisnik: any) {
    try {
      this.korisniciService.spremiKorisnika(korisnik);
      await this.korisniciService.dajPristup(korisnik.korime);
      korisnik.status = 1;
    } catch (error) {
      this.errorMessage = 'Greška prilikom davanja pristupa.';
    }
  }

  async zabraniPristup(korisnik: any) {
    try {
      this.korisniciService.spremiKorisnika(korisnik);
      await this.korisniciService.zabraniPristup(korisnik.korime);
      korisnik.status = 0;
    } catch (error) {
      this.errorMessage = 'Greška prilikom zabrane pristupa.';
    }
  }
  
}
