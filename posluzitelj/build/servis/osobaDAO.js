import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class OsobaDAO {
    baza;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
    }
    async dajSve() {
        let sql = "SELECT * FROM osoba;";
        var podaci = await this.baza.dajPodatkePromise(sql, []);
        let rezultat = new Array();
        for (let p of podaci) {
            let k = { id: p["id"], ime_prezime: p["ime_prezime"], poznat_po: p["poznat_po"], slika: p["slika"], popularnost: p["popularnost"] };
            rezultat.push(k);
        }
        return rezultat;
    }
    async daj(id) {
        let sql = "SELECT * FROM osoba WHERE id=?;";
        var podaci = await this.baza.dajPodatkePromise(sql, [id]);
        if (podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let k = { id: p["id"], ime_prezime: p["ime_prezime"], poznat_po: p["poznat_po"], slika: p["slika"], popularnost: p["popularnost"] };
            return k;
        }
        return null;
    }
    dodaj(osoba) {
        let sql = `INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (?,?,?,?,?)`;
        let podaci = [osoba.id, osoba.ime_prezime,
            osoba.poznat_po, osoba.slika, osoba.popularnost];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    async obrisi(id) {
        const obrisiVezeFilmSql = "DELETE FROM osoba_film WHERE osoba_id = ?;";
        const obrisiOsobuSql = "DELETE FROM osoba WHERE id = ?;";
        try {
            this.baza.ubaciAzurirajPodatke(obrisiVezeFilmSql, [id]);
            this.baza.ubaciAzurirajPodatke(obrisiOsobuSql, [id]);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    async dajSveStranica(offset, brojElemenata) {
        const sql = "SELECT * FROM osoba LIMIT ? OFFSET ?;";
        const podaci = await this.baza.dajPodatkePromise(sql, [brojElemenata, offset]);
        return podaci.map((p) => ({
            id: p["id"],
            ime_prezime: p["ime_prezime"],
            poznat_po: p["poznat_po"],
            slika: p["slika"],
            popularnost: p["popularnost"],
        }));
    }
}
