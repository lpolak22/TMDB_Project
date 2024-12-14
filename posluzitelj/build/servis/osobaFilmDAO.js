import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class OsobaFilmDAO {
    baza;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
    }
    async dajFilmoveZaOsobu(id, stranica) {
        const brojElemenata = 20;
        const offset = (stranica - 1) * brojElemenata;
        try {
            const sql = `
        SELECT 
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
        }
        catch (err) {
            throw new Error("Greška pri dohvaćanju podataka iz baze");
        }
    }
    async poveziOsobuSaFilmovima(osobaId, filmovi) {
        const sqlProveriFilm = "SELECT COUNT(*) AS broj FROM film WHERE id = ?";
        const sqlProveriOsobu = "SELECT COUNT(*) AS broj FROM osoba WHERE id = ?";
        const sqlDodavanjeVeze = "INSERT INTO osoba_film (film_id, osoba_id, lik) VALUES (?, ?, ?)";
        for (const film of filmovi) {
            const filmPostoji = (await this.baza.dajPodatkePromise(sqlProveriFilm, [film.film_id]));
            const osobaPostoji = (await this.baza.dajPodatkePromise(sqlProveriOsobu, [osobaId]));
            if (filmPostoji[0].broj === 0) {
                throw new Error(`Film s ID-jem ${film.film_id} ne postoji u bazi.`);
            }
            if (osobaPostoji[0].broj === 0) {
                throw new Error(`Osoba s ID-jem ${osobaId} ne postoji u bazi.`);
            }
            await this.baza.ubaciAzurirajPodatke(sqlDodavanjeVeze, [film.film_id, osobaId, film.lik || null]);
        }
    }
    async obrisiVezeOsobeNaFilmove(idOsobe) {
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
        }
        catch (err) {
            if (err instanceof Error && err.message === "nepostojeća veza") {
                throw new Error("Greška: nepostojeća veza");
            }
            console.error("Greška pri brisanju veze osobe na film:", err);
            throw new Error("Greška pri brisanju veze u bazi");
        }
    }
}
