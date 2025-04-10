import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FiltriranjeFilmovaService } from "../servisi/filtriranje-filmova.service";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-filtriranje-filmova",
  standalone: false,
  templateUrl: "./filtriranje-filmova.component.html",
  styleUrls: ["./filtriranje-filmova.component.scss"],
})
export class FiltriranjeFilmovaComponent {
  datumOd: string | undefined;
  datumDo: string | undefined;
  filmovi: any[] = [];
  prikazaniFilmovi: any[] = [];
  trenutnaStranica: number = 1;
  brojFilmovaPoStranici: number = 20;
  ukupanBrojFilmova: number = 0;
  ukupanBrojStranica: number = 1;
  porukaGreske: string | null = null;

  constructor(
    private filtriranjeService: FiltriranjeFilmovaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.filtrirajFilmove();
  }

  async filtrirajFilmove() {
    this.porukaGreske = null;

    try {
      let datumOdMillisekunde = this.datumOd
        ? new Date(this.datumOd).getTime().toString()
        : undefined;
      let datumDoMillisekunde = this.datumDo
        ? new Date(this.datumDo).getTime().toString()
        : undefined;

      const rezultat = await this.filtriranjeService.loadFilmovi(
        this.trenutnaStranica,
        datumOdMillisekunde,
        datumDoMillisekunde
      );

      this.filmovi = rezultat.filmovi || [];
      this.ukupanBrojFilmova = rezultat.ukupno || 0;
      this.ukupanBrojStranica = Math.ceil(
        this.ukupanBrojFilmova / this.brojFilmovaPoStranici
      );
    } catch (error) {
      console.error(error);
      this.porukaGreske = "Došlo je do pogreške, žao nam je.";
    }
  }

  azurirajPrikazaneFilmove() {
    let pocIndeks = (this.trenutnaStranica - 1) * this.brojFilmovaPoStranici;
    let krajIndeks = pocIndeks + this.brojFilmovaPoStranici;
    this.prikazaniFilmovi = this.filmovi.slice(pocIndeks, krajIndeks);
  }

  onPromjenaStranice(page: number) {
    if (page < 1 || page > this.ukupanBrojStranica) return;
    this.trenutnaStranica = page;
    this.filtrirajFilmove();
  }

  azurirajBrojStranica() {
    this.ukupanBrojStranica = Math.ceil(
      this.ukupanBrojFilmova / this.brojFilmovaPoStranici
    );
  }

  idiNaPrvuStranicu() {
    this.trenutnaStranica = 1;
    this.filtrirajFilmove();
  }

  idiNaPosljednjuStranicu() {
    this.trenutnaStranica = this.ukupanBrojStranica;
    this.filtrirajFilmove();
  }

  odiNaStranicuDetalja(id: number) {
    this.router.navigate(["/detalji", id]);
  }
  pretvoriSliku(slika: string): string {
    if (!slika) {
      return "../../assets/default-image.png";
    }

    if (slika.startsWith("http")) {
      return slika;
    }

    return `${environment.posteriPutanja}${slika}`;
  }
}
