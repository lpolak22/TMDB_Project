import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-detalji',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalji.component.html',
  styleUrls: ['./detalji.component.scss']
})
export class DetaljiComponent implements OnInit {
  osoba: any = null;
  porukaGreske: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOsobaDetalji(id);
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
        this.osoba = await response.json();
      } else {
        throw new Error('Podaci osobe nisu dostupni');
      }
    } catch (error) {
      console.error(error);
      this.porukaGreske = 'Došlo je do pogreške, žao nam je';
    }
  }
}
