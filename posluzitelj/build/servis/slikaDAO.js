import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";
export class SlikaDAO {
    baza;
    constructor() {
        this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
    }
    dodaj(slika) {
        let sql = `INSERT INTO slika (slika_putanja, osoba_id) VALUES (?,?)`;
        let podaci = [slika.slika_putanja, slika.osoba_id];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    obrisi(id) {
        const obrisiSlike = "DELETE FROM slika WHERE osoba_id = ?;";
        try {
            this.baza.ubaciAzurirajPodatke(obrisiSlike, [id]);
            return true;
        }
        catch (err) {
            console.error("Greška pri brisanju filma:", err);
            return false;
        }
    }
    async daj(osoba_id) {
        let sql = "SELECT * FROM slika WHERE osoba_id = ?";
        const podaci = await this.baza.dajPodatkePromise(sql, [osoba_id]);
        if (podaci.length > 0) {
            return podaci.map(p => ({
                id: p["id"],
                slika_putanja: p["slika_putanja"],
                osoba_id: p["osoba_id"]
            }));
        }
        return [];
    }
}
