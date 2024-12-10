import { OsobaTmdbI } from "src/servisI/tmdbI.js";
import Baza from "../zajednicko/sqliteBaza.js";
import path from "path";
import { __dirname } from "../zajednicko/esmPomocnik.js";

export class OsobaDAO {
  private baza:Baza;

	constructor() {
		this.baza = new Baza(path.resolve(__dirname(), "../../podaci/RWA2024lpolak22_servis.sqlite"));
	}

	async dajSve():Promise<Array<OsobaTmdbI>> {
		let sql = "SELECT * FROM osoba;"
		var podaci = await this.baza.dajPodatkePromise(sql,[]) as Array<OsobaTmdbI>;
    let rezultat = new Array<OsobaTmdbI>();
    for(let p of podaci){
      let k:OsobaTmdbI = {id: p["id"], ime_prezime:p["ime_prezime"], poznat_po:p["poznat_po"], slika:p["slika"], popularnost:p["popularnost"]};
      rezultat.push(k);
    }
		return rezultat;
	}

	async daj (id:number):Promise<OsobaTmdbI|null> {
		let sql = "SELECT * FROM osoba WHERE id=?;"
		var podaci = await this.baza.dajPodatkePromise(sql, [id]) as Array<OsobaTmdbI>;

		if(podaci.length == 1 && podaci[0]!=undefined){
      let p = podaci[0];
      let k:OsobaTmdbI = {id: p["id"], ime_prezime:p["ime_prezime"], poznat_po:p["poznat_po"], slika:p["slika"], popularnost:p["popularnost"]};
			return k;
    }

    return null;
	}

	dodaj(osoba:OsobaTmdbI) {
		let sql = `INSERT INTO osoba (id, ime_prezime, poznat_po, slika, popularnost) VALUES (?,?,?,?,?)`;
        let podaci = [osoba.id,osoba.ime_prezime,
                      osoba.poznat_po,osoba.slika,osoba.popularnost];
	  this.baza.ubaciAzurirajPodatke(sql,podaci);
		return true;
	}

	async obrisi(id: number): Promise<boolean> {
        const obrisiVezeFilmSql = "DELETE FROM osoba_film WHERE osoba_id = ?;";
        const obrisiOsobuSql = "DELETE FROM osoba WHERE id = ?;";
    
        try {
            this.baza.ubaciAzurirajPodatke(obrisiVezeFilmSql, [id]);
    
            this.baza.ubaciAzurirajPodatke(obrisiOsobuSql, [id]);
    
            return true;
        } catch (error) {
            return false;
        }
    }

	azuriraj(id:number, osoba:OsobaTmdbI) {
		let sql = `UPDATE osoba SET ime_prezime=?, poznat_po=?, slika=?, popularnost=? WHERE id=?`;
        let podaci = [osoba.id,osoba.ime_prezime,
            osoba.poznat_po,osoba.slika,osoba.popularnost];
		this.baza.ubaciAzurirajPodatke(sql,podaci);
		return true;
	}

  async dajSveStranica(offset: number, brojElemenata: number): Promise<Array<OsobaTmdbI>> {
    const sql = "SELECT * FROM osoba LIMIT ? OFFSET ?;";
    const podaci = await this.baza.dajPodatkePromise(sql, [brojElemenata, offset]) as Array<OsobaTmdbI>;

    return podaci.map((p) => ({
      id: p["id"],
      ime_prezime: p["ime_prezime"],
      poznat_po: p["poznat_po"],
      slika: p["slika"],
      popularnost: p["popularnost"],
    }));
  }
  
}