import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";

export class OsobaFilmDAO {
  private baza: Baza;

  constructor() {
		this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
  }

  async dajFilmoveZaOsobu(id: number, stranica: number): Promise<any[]> {
    let brojElemenata = 20;
    let offset = (stranica - 1) * brojElemenata;

    try {
      const sql = `
        SELECT 
        f.id, 
        f.naslov, 
        f.originalni_naslov, 
        f.jezik, 
        f.popularnost, 
        f.slikica_postera, 
        f.datum_izdavanja, 
        f.opis,
        ofi.lik
        FROM film f
        INNER JOIN osoba_film ofi ON f.id = ofi.film_id
        WHERE ofi.osoba_id = ?
        LIMIT ? OFFSET ?;
      `;

      let rezultat = await this.baza.dajPodatke(sql, [id, brojElemenata, offset]);

      return rezultat;
    } catch (err) {
      throw new Error("Greška pri dohvaćanju podataka iz baze");
    }
}

async poveziOsobuSaFilmovima(osobaId: number, filmovi: Array<any>): Promise<void> {
  let sqlProvjeriFilm = "SELECT COUNT(*) AS broj FROM film WHERE id = ?";
  let sqlProvjeriOsobu = "SELECT COUNT(*) AS broj FROM osoba WHERE id = ?";
  let sqlDodavanjeVeze = "INSERT INTO osoba_film (film_id, osoba_id, lik) VALUES (?, ?, ?)";

  for (let film of filmovi) {
    const filmPostoji = (await this.baza.dajPodatkePromise(sqlProvjeriFilm, [film.id])) as any;
    const osobaPostoji = (await this.baza.dajPodatkePromise(sqlProvjeriOsobu, [osobaId])) as any;

    if (filmPostoji[0].broj === 0) {
      throw new Error(`Film s ID-jem ${film.id} ne postoji u bazi.`);
    }

    if (osobaPostoji[0].broj === 0) {
      throw new Error(`Osoba s ID-jem ${osobaId} ne postoji u bazi.`);
    }

    await this.baza.ubaciAzurirajPodatke(sqlDodavanjeVeze, [film.id, osobaId, film.lik]);
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
