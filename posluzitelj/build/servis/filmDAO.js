import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class FilmDAO {
    baza;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
    }
    async daj(id) {
        const sql = "SELECT * FROM film WHERE id=?;";
        try {
            const podaci = await this.baza.dajPodatkePromise(sql, [id]);
            if (podaci.length === 1) {
                const p = podaci[0];
                return {
                    id: p.id ?? 0,
                    jezik: p.jezik ?? "",
                    originalni_naslov: p.originalni_naslov ?? "",
                    naslov: p.naslov ?? "",
                    popularnost: p.popularnost ?? 0,
                    slikica_postera: p.slikica_postera ?? "",
                    datum_izdavanja: p.datum_izdavanja ?? "",
                    opis: p.opis ?? "",
                    lik: p.lik ?? ""
                };
            }
            return null;
        }
        catch (err) {
            console.error("Greška pri dohvaćanju filma:", err);
            throw new Error("Greška pri dohvaćanju filma");
        }
    }
    dodaj(film) {
        const sql = `
      INSERT INTO film (id, jezik, originalni_naslov, naslov, popularnost, slikica_postera, datum_izdavanja, opis)
      VALUES (?, ?,?,?,?,?,?,?);
    `;
        const podaci = [
            film.id,
            film.jezik ?? "",
            film.originalni_naslov ?? "",
            film.naslov ?? "",
            film.popularnost ?? 0,
            film.slikica_postera ?? "",
            film.datum_izdavanja ?? "",
            film.opis ?? ""
        ];
        try {
            this.baza.ubaciAzurirajPodatke(sql, podaci);
            return true;
        }
        catch (err) {
            console.error("Greška pri dodavanju filma:", err);
            return false;
        }
    }
    async obrisi(id) {
        const obrisiVezeFilmSql = "DELETE FROM osoba_film WHERE film_id = ?;";
        const obrisiOsobuSql = "DELETE FROM film WHERE id = ?;";
        try {
            await this.baza.ubaciAzurirajPodatke(obrisiVezeFilmSql, [id]);
            await this.baza.ubaciAzurirajPodatke(obrisiOsobuSql, [id]);
            return true;
        }
        catch (err) {
            console.error("Greška pri brisanju filma:", err);
            return false;
        }
    }
    async dajSveStranica(offset, brojElemenata) {
        const sql = "SELECT * FROM film LIMIT ? OFFSET ?;";
        try {
            const podaci = await this.baza.dajPodatkePromise(sql, [brojElemenata, offset]);
            if (!podaci || podaci.length === 0) {
                return [];
            }
            return podaci.map((p) => ({
                id: p.id ?? 0,
                jezik: p.jezik ?? "",
                originalni_naslov: p.originalni_naslov ?? "",
                naslov: p.naslov ?? "",
                popularnost: p.popularnost ?? 0,
                slikica_postera: p.slikica_postera ?? "",
                datum_izdavanja: p.datum_izdavanja ?? "",
                opis: p.opis ?? "",
                lik: p.lik ?? ""
            }));
        }
        catch (err) {
            console.error("Greška pri dohvaćanju filmova sa stranica:", err);
            throw new Error("Greška pri dohvaćanju filmova sa stranica");
        }
    }
    async dajOsobeZaFilm(id) {
        const sql = "SELECT * FROM osoba_film WHERE film_id = ?;";
        try {
            const podaci = await this.baza.dajPodatkePromise(sql, [id]);
            if (!podaci) {
                return [];
            }
            return podaci;
        }
        catch (err) {
            console.error("Greška pri dohvaćanju osoba za film:", err);
            throw new Error("Greška pri dohvaćanju osoba za film");
        }
    }
    async dajFilmovePoDatumuSaStranica(datumOd, datumDo, offset, brojElemenata) {
        const sql = `
      SELECT * 
      FROM film 
      WHERE datum_izdavanja BETWEEN ? AND ?
      ORDER BY datum_izdavanja ASC
      LIMIT ? OFFSET ?;
    `;
        const sqlUkupno = `
      SELECT COUNT(*) as ukupno
      FROM film 
      WHERE datum_izdavanja BETWEEN ? AND ?;
    `;
        try {
            const datumOdStr = datumOd
                ? datumOd.toISOString().split("T")[0]
                : "1000-01-01";
            const datumDoStr = datumDo
                ? datumDo.toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0];
            const podaci = await this.baza.dajPodatkePromise(sql, [
                datumOdStr,
                datumDoStr,
                brojElemenata,
                offset,
            ]);
            const ukupnoPodaci = await this.baza.dajPodatkePromise(sqlUkupno, [
                datumOdStr,
                datumDoStr,
            ]);
            const ukupno = ukupnoPodaci[0].ukupno;
            if (!podaci || podaci.length === 0) {
                return { filmovi: [], ukupno };
            }
            const filmovi = podaci.map((p) => ({
                id: p.id ?? 0,
                jezik: p.jezik ?? "",
                originalni_naslov: p.originalni_naslov ?? "",
                naslov: p.naslov ?? "",
                popularnost: p.popularnost ?? 0,
                slikica_postera: p.slikica_postera ?? "",
                datum_izdavanja: p.datum_izdavanja ?? "",
                opis: p.opis ?? "",
                lik: p.lik ?? ""
            }));
            return { filmovi, ukupno };
        }
        catch (err) {
            throw new Error("Greška pri dohvaćanju filmova po datumu sa stranica");
        }
    }
}
