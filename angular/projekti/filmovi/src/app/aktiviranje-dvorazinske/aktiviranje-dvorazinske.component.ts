import { Component, OnInit } from '@angular/core';
import { AktiviranjeDvorazinskeService } from '../servisi/aktiviranje-dvorazinske.service';

@Component({
  selector: 'app-aktiviranje-dvorazinske',
  standalone: false,
  templateUrl: './aktiviranje-dvorazinske.component.html',
  styleUrl: './aktiviranje-dvorazinske.component.scss'
})
export class AktiviranjeDvorazinskeComponent implements OnInit {
  ukljuceno: boolean = false;
  tajniKljuc: string | null = null;

  constructor(private dvorazinskaService: AktiviranjeDvorazinskeService) {}

  async ngOnInit() {
    const korime = this.korime();
    if (!korime) {
      console.error('Korisničko ime nije pronađeno u sesiji.');
      return;
    }
      const totpStatus = await this.dvorazinskaService.dohvatiTOTP(korime);
      
      this.tajniKljuc = totpStatus?.tajniKljuc[0].totp;
    const dvaFA = await this.dvorazinskaService.provjeriDvaFA(korime);
    if(dvaFA==1){
      this.tajniKljuc = totpStatus.tajniKljuc[0].totp;
      this.ukljuceno = true;
    }
    else{
      this.ukljuceno = false;
      this.tajniKljuc = null;
    } 
  
  }

  async ngOnChange(){
    const korime = this.korime();

    if (!korime) {
      console.error('Korisničko ime nije pronađeno u sesiji.');
      return;
    } 
  }

  async ukljuciTOTP() {
    const korime = this.korime();
    if (!korime) {
      console.error('Korisničko ime nije pronađeno u sesiji.');
      return;
    }

    try {
      const dvaFA = await this.dvorazinskaService.provjeriDvaFA(korime);
      let totpStatus = await this.dvorazinskaService.dohvatiTOTP(korime);
      
      
      let rezultat;
      if (dvaFA !== 1 && totpStatus.tajniKljuc[0].totp==null) {
        rezultat = await this.dvorazinskaService.azurirajTOTP(korime, null);
      }
      if(dvaFA !== 1 && totpStatus.tajniKljuc[0].totp!==null){
        rezultat = await this.dvorazinskaService.azurirajTOTP(korime, totpStatus.tajniKljuc[0].totp)
      }
      totpStatus = await this.dvorazinskaService.dohvatiTOTP(korime);
      this.tajniKljuc = totpStatus?.tajniKljuc[0].totp;

      this.tajniKljuc = totpStatus.tajniKljuc[0].totp;
      this.ukljuceno = true;
    } catch (err) {
      console.error('Greška prilikom uključivanja TOTP:', err);
    }
  }

  async iskljuciTOTP() {
    const korime = this.korime();
    if (!korime) {
      console.error('Korisničko ime nije pronađeno u sesiji.');
      return;
    }

    try {
      await this.dvorazinskaService.deaktivirajTOTP(korime);
      await this.dvorazinskaService.provjeriDvaFA(korime);
      this.ukljuceno = false;
      this.tajniKljuc = null;
    } catch (err) {
      console.error('Greška prilikom isključivanja TOTP:', err);
    }
  }

  korime(): string | null {
    const korisnik = sessionStorage.getItem('korisnik');
    if (korisnik) {
      const sesijaKorime = JSON.parse(korisnik);
      return sesijaKorime.korime;
    }
    return null;
  }
}
