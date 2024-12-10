import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";

export class OsobaFilmDAO {
  private baza: Baza;

  constructor() {
		this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
  }

  async dajFilmoveZaOsobu(id: number, stranica: number): Promise<any[]> {
    const brojElemenata = 20;
    const offset = (stranica - 1) * brojElemenata;

    try {
      const sql = `
        SELECT 
            o.id AS osoba_id, 
            o.ime_prezime, 
            o.poznat_po, 
            o.slika AS slika_osobe, 
            o.popularnost AS popularnost_osobe,
            f.id AS film_id, 
            f.naslov, 
            f.originalni_naslov, 
            f.jezik, 
            f.popularnost AS popularnost_filma, 
            f.slikica_postera, 
            f.datum_izdavanja, 
            f.opis AS opis_filma, 
            ofi.lik AS lik_u_filmu
        FROM osoba_film ofi
        JOIN osoba o ON ofi.osoba_id = o.id
        JOIN film f ON ofi.film_id = f.id
        WHERE o.id = ? 
        LIMIT ? OFFSET ?;
      `;
      return this.baza.dajPodatke(sql, [id, brojElemenata, offset]);
    } catch (err) {
      throw new Error("Greška pri dohvaćanju podataka iz baze");
    }
}

async poveziOsobuSaFilmovima(idOsobe: number, filmovi: Array<{ id: number; lik: string }>): Promise<void> {
  const sql = `
      INSERT INTO osoba_film (osoba_id, film_id, lik)
      VALUES (?, ?, ?)
  `;

  try {
      for (const film of filmovi) {
          const { id, lik } = film;
          await this.baza.ubaciAzurirajPodatke(sql, [idOsobe, id, lik]);
      }
  } catch (err) {
      throw new Error("Greška pri povezivanju osobe s filmovima");
  }
}

async obrisiVezeOsobeNaFilmove(idOsobe: number): Promise<void> {
  const provjeraSQL = `
      SELECT 1
      FROM osoba_film
      WHERE osoba_id = ?
  `;

  const sql = `
      DELETE FROM osoba_film
      WHERE osoba_id = ?
  `;

  try {
      const postojiVeza = await this.baza.dajPodatke(provjeraSQL, [idOsobe]);

      if (postojiVeza.length === 0) {
          throw new Error("nepostojeća veza");
      }
      
      await this.baza.ubaciAzurirajPodatke(sql, [idOsobe]);
  } catch (err) {
      if (err instanceof Error && err.message === "nepostojeća veza") {
          throw new Error("Greška: nepostojeća veza");
      }
      console.error("Greška pri brisanju veze osobe na film:", err);
      throw new Error("Greška pri brisanju veze u bazi");
  }
}

}
