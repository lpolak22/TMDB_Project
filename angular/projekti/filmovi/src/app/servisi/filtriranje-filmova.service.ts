import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FiltriranjeFilmovaService {
  restServis: string = environment.restServis;

  constructor() {}

  async loadFilmovi(stranica: number, datumOd?: string, datumDo?: string) {
    let parametar = `?stranica=${stranica}`;

    if (datumOd) parametar += `&datumOd=${datumOd}`;
    if (datumDo) parametar += `&datumDo=${datumDo}`;

    try {
      const response = await fetch(`${this.restServis}film${parametar}`);

      if (!response.ok) {
        throw new Error("Greška pri dohvaćanju filmova");
      }
      const rezultat = await response.json();

      return rezultat;
    } catch (error) {
      console.error("Greška:", error);
      throw new Error("Žao nam je, došlo je do pogreške.");
    }
  }
}
