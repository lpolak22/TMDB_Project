import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OsobeService } from '../servisi/osobe.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-osobe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './osobe.component.html',
  styleUrls: ['./osobe.component.scss']
})
export class OsobeComponent implements OnInit {
  porukaGreske: string | null = null; 
  sveOsobe: any[] = []; 
  prikazaneOsobe: any[] = []; 
  trenutnaStranica: number = 1; 
  brojOsobaPoStranici: number = 10; 
  ukupanBrojOsoba: number = 0; 
  ukupanBrojStranica: number = 0;

  constructor(private router: Router, private osobeService: OsobeService) {}

  ngOnInit() {
    this.loadOsobe();
  }

  async loadOsobe() {
    try {
      this.sveOsobe = await this.osobeService.loadOsobe(this.trenutnaStranica);
      this.ukupanBrojOsoba = this.sveOsobe.length;

      this.azurirajBrojStranica();
      this.azurirajPrikazaneOsobe();
    } catch (error) {
      console.error(error);
      this.porukaGreske = 'Došlo je do pogreške, žao nam je';
    }
  }

  azurirajPrikazaneOsobe() {
    const pocIndeks = (this.trenutnaStranica - 1) * this.brojOsobaPoStranici;
    const krajIndeks = pocIndeks + this.brojOsobaPoStranici;
    this.prikazaneOsobe = this.sveOsobe.slice(pocIndeks, krajIndeks); 
  }

  onPromjenaStranice(page: number) {
    if (page < 1 || page > this.ukupanBrojStranica) return;
    this.trenutnaStranica = page;
    this.azurirajPrikazaneOsobe();
  }

  onPromjenaOsobaPoStranici(event: Event) {
    const odabranaVrijednost = (event.target as HTMLSelectElement).value;
    this.brojOsobaPoStranici = parseInt(odabranaVrijednost, 10);
    this.trenutnaStranica = 1; 
    this.azurirajBrojStranica();
    this.azurirajPrikazaneOsobe();
  }

  odiNaStranicuDetalja(id: number) {
    this.router.navigate(['/detalji', id]);
  }

  azurirajBrojStranica() {
    this.ukupanBrojStranica = Math.ceil(this.ukupanBrojOsoba / this.brojOsobaPoStranici);
  }

  idiNaPrvuStranicu() {
    this.trenutnaStranica = 1;
    this.azurirajPrikazaneOsobe();
  }

  idiNaPosljednjuStranicu() {
    this.trenutnaStranica = this.ukupanBrojStranica;
    this.azurirajPrikazaneOsobe();
  }

  pretvoriSliku(slika: string): string {
    if (!slika) {
      return '../../assets/default-image.png'; 
    }
  
    if (slika.startsWith('http')) {
      return slika;
    }
  
    return `${environment.slikaOsobePutanja}${slika}`;
  }
  
}
