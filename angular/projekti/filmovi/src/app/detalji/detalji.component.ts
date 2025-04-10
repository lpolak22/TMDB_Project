import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../environments/environment";
import { DetaljiService } from "../servisi/detalji.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-detalji",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./detalji.component.html",
  styleUrls: ["./detalji.component.scss"],
})
export class DetaljiComponent implements OnInit {
  osoba: any = null;
  porukaGreske: string | null = null;
  slikeOsobe: string[] = [];
  filmovi: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private detaljiService: DetaljiService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.loadOsobaDetalji(id);
      this.loadSlikeGalerija(id);
      this.loadFilmovi(Number(id));
    }
  }

  async loadOsobaDetalji(id: string) {
    try {
      await this.detaljiService.loadOsobaDetalji(id);
      this.osoba = this.detaljiService.osoba;
    } catch (error) {
      console.error(
        "Došlo je do pogreške pri dohvaćanju podataka osobe",
        error
      );
      this.porukaGreske = "Došlo je do pogreške pri dohvaćanju podataka osobe";
    }
  }

  async loadSlikeGalerija(id: string) {
    try {
      await this.detaljiService.loadSlikeGalerija(id);
      this.slikeOsobe = this.detaljiService.slikeOsobe;
    } catch (error) {
      console.error(
        "Došlo je do pogreške pri dohvaćanju galerije slika",
        error
      );
      this.porukaGreske = "Galerija slika nije dostupna.";
    }
  }

  preskociSlomljenuSliku(slomljenaSlika: string) {
    this.slikeOsobe = this.slikeOsobe.filter(
      (slika) => slika !== slomljenaSlika
    );
  }

  async loadFilmovi(id: number) {
    try {
      this.filmovi = await this.detaljiService.dohvatiPovezaneFilmove(id);
    } catch (error) {
      console.error("Došlo je do pogreške pri dohvaćanju filmova", error);
      this.porukaGreske = "Došlo je do pogreške pri dohvaćanju filmova";
    }
  }
}
