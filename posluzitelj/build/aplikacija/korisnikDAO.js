import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class KorisnikDAO {
    baza;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_web.sqlite"));
    }
    async dajSve() {
        let sql = "SELECT * FROM korisnik;";
        var podaci = await this.baza.dajPodatkePromise(sql, []);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = {
                ime: p["ime"],
                prezime: p["prezime"],
                korime: p["korime"],
                lozinka: p["lozinka"],
                email: p["email"],
                tip_korisnika_id: p["tip_korisnika_id"],
                adresa: p["adresa"] || null,
                status: p["status"] || null,
                broj_telefona: p["broj_telefona"] || null,
                datum_rodenja: p["datum_rodenja"] || null
            };
            rezultat.push(k);
        }
        return rezultat;
    }
    async daj(korime) {
        let sql = "SELECT * FROM korisnik WHERE korime=?;";
        var podaci = await this.baza.dajPodatkePromise(sql, [korime]);
        if (podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let k = {
                ime: p["ime"] || null,
                prezime: p["prezime"] || null,
                korime: p["korime"],
                lozinka: p["lozinka"],
                email: p["email"],
                tip_korisnika_id: p["tip_korisnika_id"],
                adresa: p["adresa"] || null,
                status: p["status"] || null,
                broj_telefona: p["broj_telefona"] || null,
                datum_rodenja: p["datum_rodenja"] || null
            };
            return k;
        }
        return null;
    }
    async prijaviKorisnika(korime, lozinka) {
        const sql = `SELECT * FROM korisnik WHERE korime = ? AND lozinka = ? LIMIT 1`;
        const podaci = [korime, lozinka];
        try {
            const rezultat = await this.baza.dajPodatkePromise(sql, podaci);
            if (rezultat.length > 0) {
                return rezultat[0];
            }
            else {
                return null;
            }
        }
        catch (err) {
            console.error("Greška prilikom provjere korisnika: ", err);
            return null;
        }
    }
    async dodaj(korisnik) {
        let sql = `INSERT INTO korisnik (ime, prezime, lozinka, email, korime, tip_korisnika_id, adresa, status, broj_telefona, datum_rodenja)
				   VALUES (?, ?, ?, ?, ?, 2, ?, 0, ?, ?)`;
        let podaci = [
            korisnik.ime || null,
            korisnik.prezime || null,
            korisnik.lozinka,
            korisnik.email,
            korisnik.korime,
            korisnik.adresa || null,
            korisnik.broj_telefona || null,
            korisnik.datum_rodenja || null
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    async obrisi(korime) {
        const sql = "DELETE FROM korisnik WHERE korime=?";
        try {
            await this.baza.ubaciAzurirajPodatke(sql, [korime]);
        }
        catch (err) {
            console.error("Greška pri brisanju korisnika:", err);
            throw err;
        }
    }
    azuriraj(korime, korisnik) {
        let sql = `UPDATE korisnik 
				   SET ime=?, prezime=?, lozinka=?, email=?, tip_korisnika_id=?, adresa=?, status=?, broj_telefona=?, datum_rodenja=? 
				   WHERE korime=?`;
        let podaci = [
            korisnik.ime || null,
            korisnik.prezime || null,
            korisnik.lozinka,
            korisnik.email,
            korisnik.tip_korisnika_id || 2,
            korisnik.adresa || null,
            korisnik.status || 0,
            korisnik.broj_telefona || null,
            korisnik.datum_rodenja || null,
            korime
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
}
