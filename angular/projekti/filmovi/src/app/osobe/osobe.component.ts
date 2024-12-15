import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit() {
    this.loadSveOsobe(); 
  }

  async loadSveOsobe() {
    try {
      const response = await fetch(`${environment.restServis}osoba`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        this.sveOsobe = await response.json();
        this.ukupanBrojOsoba = this.sveOsobe.length; 
        console.log("Ukupan broj osoba:", this.ukupanBrojOsoba);
        
        this.azurirajBrojStranica();
        this.azurirajPrikazaneOsobe(); 
      } else {
        throw new Error('Trenutno nije moguće prikazati osobe');
      }
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
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.brojOsobaPoStranici = parseInt(selectedValue, 10);
    this.trenutnaStranica = 1; 
    this.azurirajBrojStranica();
    this.azurirajPrikazaneOsobe();
  }

  odiNaStranicuDetalja(id: number) {
    window.location.href = `/detalji/${id}`;
  }

  azurirajBrojStranica() {
    this.ukupanBrojStranica = Math.ceil(this.ukupanBrojOsoba / this.brojOsobaPoStranici);
    console.log('Ukupan broj stranica:', this.ukupanBrojStranica);
  }
}
