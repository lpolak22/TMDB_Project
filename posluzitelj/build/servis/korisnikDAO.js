import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class KorisnikDAO {
    baza;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
    }
    //   async dajSve(): Promise<KorisnikI[]> {
    //     const sql = "SELECT * FROM korisnik";
    //     const podaci = (await this.baza.dajPodatkePromise(sql, [])) as Array<any>;
    //     return podaci.map(p => {
    //         return {
    //             ime: p["ime"] || null,
    //             prezime: p["prezime"] || null,
    //             korime: p["korime"],
    //             lozinka: p["lozinka"],
    //             email: p["email"],
    //             tip_korisnika_id: p["tip_korisnika_id"],
    //             adresa: p["adresa"] || null,
    //             status: p["status"] || null,
    //             broj_telefona: p["broj_telefona"] || null,
    //             datum_rodenja: p["datum_rodenja"] || null,
    //         };
    //     });
    // }
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
                broj_telefona: p["broj_telefona"] || null,
                datum_rodenja: p["datum_rodenja"] || null,
            };
            return k;
        }
        return null;
    }
    dodaj(korisnik) {
        let sql = `INSERT INTO korisnik (ime, prezime, lozinka, email, korime, tip_korisnika_id, adresa, status, broj_telefona, datum_rodenja) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let podaci = [
            korisnik.ime,
            korisnik.prezime,
            korisnik.lozinka,
            korisnik.email,
            korisnik.korime,
            korisnik.tip_korisnika_id,
            korisnik.adresa,
            korisnik.status || null,
            korisnik.broj_telefona || null,
            korisnik.datum_rodenja || null,
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
    async postojiKorisnik(korime) {
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
}
