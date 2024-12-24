import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { DetaljiService } from '../servisi/detalji.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalji',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalji.component.html',
  styleUrls: ['./detalji.component.scss'],
})
export class DetaljiComponent implements OnInit {
  osoba: any = null;
  porukaGreske: string | null = null;
  slikeOsobe: Array<string> = [];
  filmovi: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private detaljiService: DetaljiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOsobaDetalji(id);
      this.loadSlikeOsobe(id);
      this.loadFilmovi(Number(id));
    }
  }

  async loadOsobaDetalji(id: string) {
    try {
      const response = await fetch(`${environment.restServis}osoba/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        this.osoba = {
          ...data,
          slika: this.prebaciSliku(data.slika),
        };
      } else {
        throw new Error('Podaci osobe nisu dostupni');
      }
    } catch (error) {
      console.error(error);
      this.porukaGreske = 'Došlo je do pogreške, žao nam je';
    }
  }

  prebaciSliku(slika: string): string {
    if (!slika) {
      return '../../assets/default-image.jpg';
    }

    if (slika.startsWith('http')) {
      return slika;
    }

    return `${environment.slikaOsobePutanja}${slika}`;
  }

  async loadSlikeOsobe(id: string) {
    try {
      const response = await fetch(`${environment.restServis}app/detalji/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        this.slikeOsobe = data.slike.map((slika: string) =>
          this.prebaciSliku(slika)
        );
      } else {
        throw new Error('Slike osobe nisu dostupne');
      }
    } catch (error) {
      console.error(error);
      this.porukaGreske = 'Došlo je do pogreške pri dohvaćanju slika';
    }
  }

  async loadFilmovi(id: number) {
    try {
      this.filmovi = await this.detaljiService.dohvatiPovezaneFilmove(id);
    } catch (error) {
      console.error('Došlo je do pogreške pri dohvaćanju filmova', error);
      this.porukaGreske = 'Došlo je do pogreške pri dohvaćanju filmova';
    }
  }
  
}
