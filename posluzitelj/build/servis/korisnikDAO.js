import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class KorisnikDAO {
    baza;
    baza_servis;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_web.sqlite"));
        this.baza_servis = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
    }
    async dajSve() {
        const sql = "SELECT * FROM korisnik";
        const podaci = (await this.baza.dajPodatkePromise(sql, []));
        return podaci.map(p => {
            return {
                ime: p["ime"] || null,
                prezime: p["prezime"] || null,
                korime: p["korime"],
                lozinka: p["lozinka"],
                email: p["email"],
                tip_korisnika_id: p["tip_korisnika_id"],
                adresa: p["adresa"] || null,
                status: p["status"] || null,
                AktivnaDvoAut: p["AktivnaDvoAut"] || null,
                broj_telefona: p["broj_telefona"] || null,
                datum_rodenja: p["datum_rodenja"] || null,
            };
        });
    }
    async daj(korime) {
        let sql = "SELECT * FROM korisnik WHERE korime=?;";
        var podaci = (await this.baza.dajPodatkePromise(sql, [korime]));
        if (podaci.length === 1 && podaci[0] != undefined) {
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
                AktivnaDvoAut: p["AktivnaDvoAut"] || null,
                broj_telefona: p["broj_telefona"] || null,
                datum_rodenja: p["datum_rodenja"] || null,
            };
            return k;
        }
        return null;
    }
    dodaj(korisnik) {
        let sql = `INSERT INTO korisnik (ime, prezime, lozinka, email, korime, tip_korisnika_id, adresa, status, AktivnaDvoAut, broj_telefona, datum_rodenja) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let podaci = [
            korisnik.ime,
            korisnik.prezime,
            korisnik.lozinka,
            korisnik.email,
            korisnik.korime,
            korisnik.tip_korisnika_id,
            korisnik.adresa,
            korisnik.status,
            korisnik.AktivnaDvoAut,
            korisnik.broj_telefona || null,
            korisnik.datum_rodenja || null,
        ];
        this.baza_servis.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    async obrisi(korime) {
        const sql = "DELETE FROM korisnik WHERE korime=?";
        try {
            await this.baza_servis.ubaciAzurirajPodatke(sql, [korime]);
        }
        catch (err) {
            console.error("Greška pri brisanju korisnika:", err);
            throw err;
        }
    }
    async obrisiWeb(korime) {
        const sql = "DELETE FROM korisnik WHERE korime=?";
        try {
            await this.baza_servis.ubaciAzurirajPodatke(sql, [korime]);
            await this.baza.ubaciAzurirajPodatke(sql, [korime]);
        }
        catch (err) {
            console.error("Greška pri brisanju korisnika:", err);
            throw err;
        }
    }
    async postojiKorisnik(korime) {
        const sql = "SELECT COUNT(*) AS broj FROM korisnik WHERE korime = ?";
        try {
            const rezultat = (await this.baza_servis.dajPodatkePromise(sql, [korime]));
            if (rezultat.length > 0 && rezultat[0].broj > 0) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.error("Greška pri provjeri postojanja korisnika:", err);
            throw err;
        }
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
    async korisnikImaDvaFA(korime) {
        const sql = `SELECT AktivnaDvoAut FROM korisnik WHERE korime = ?`;
        const podaci = [korime];
        try {
            const rezultat = await this.baza.dajPodatkePromise(sql, podaci);
            if (rezultat && rezultat.length > 0 && rezultat[0]) {
                return rezultat[0];
            }
            else {
                return null;
            }
        }
        catch (err) {
            console.error("Greška prilikom provjere 2FA: ", err);
            return null;
        }
    }
    async azurirajKorisnika(korime, status) {
        let sql = `UPDATE korisnik SET status = ? WHERE korime = ?;`;
        let podaci = [status, korime];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    dodajKorisnik(korisnik) {
        let sql = `INSERT INTO korisnik (ime, prezime, lozinka, email, korime, tip_korisnika_id, adresa, status, AktivnaDvoAut, broj_telefona, datum_rodenja) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let podaci = [
            korisnik.ime,
            korisnik.prezime,
            korisnik.lozinka,
            korisnik.email,
            korisnik.korime,
            korisnik.tip_korisnika_id,
            korisnik.adresa,
            korisnik.status,
            korisnik.AktivnaDvoAut,
            korisnik.broj_telefona || null,
            korisnik.datum_rodenja || null,
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    async postojiKorisnikWeb(korime) {
        const sql = "SELECT COUNT(*) AS broj FROM korisnik WHERE korime = ?";
        try {
            const rezultat = (await this.baza.dajPodatkePromise(sql, [korime]));
            if (rezultat.length > 0 && rezultat[0].broj > 0) {
                return true;
            }
            return false;
        }
        catch (err) {
            console.error("Greška pri provjeri postojanja korisnika:", err);
            throw err;
        }
    }
    async azurirajTOTP(korime, tajniTOTPkljuc) {
        const sql = "UPDATE korisnik SET totp = ? WHERE korime = ?;";
        let podaci = [tajniTOTPkljuc, korime];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    async azurirajDvaFA(korime, AktivnaDvoAut) {
        const sql = "UPDATE korisnik SET AktivnaDvoAut=? WHERE korime = ?;";
        let podaci = [AktivnaDvoAut, korime];
        await this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    async dajTOTP(korime) {
        const sql = "SELECT totp FROM korisnik WHERE korime = ?";
        const podaci = await this.baza.dajPodatkePromise(sql, [korime]);
        return podaci;
    }
    async dajDvaFA(korime) {
        const sql = "SELECT AktivnaDvoAut FROM korisnik WHERE korime = ?";
        const podaci = await this.baza.dajPodatkePromise(sql, [korime]);
        return podaci;
    }
    async getStatus(korime) {
        const sql = "SELECT status FROM korisnik WHERE korime = ?";
        const podaci = await this.baza.dajPodatkePromise(sql, [korime]);
        return podaci;
    }
}
