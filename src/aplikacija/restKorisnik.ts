import { KorisnikI } from "src/servisI/korisniciI.js";
import { KorisnikDAO } from "./korisnikDAO.js";
import { Request, Response } from "express";
import { kreirajSHA256 } from "../zajednicko/kodovi.js";

export class RestKorisnik {
  private kdao;

  constructor() {
    this.kdao = new KorisnikDAO();
  }
    async postKorisnici(zahtjev: Request, odgovor: Response) {
      odgovor.type("application/json");
  
      const tijelo = zahtjev.body;
  
      if (
          !tijelo.korime || 
          !tijelo.lozinka || 
          !tijelo.email
      ) {
          odgovor.status(400).send({ greska: "Nedostaju obavezni podaci" });
          return;
      }
  
      const korisnik: KorisnikI = {
        ime: tijelo.ime || null,
        prezime: tijelo.prezime|| null,
        korime: tijelo.korime,
        lozinka: tijelo.lozinka,
        tip_korisnika_id: tijelo.tip_korisnika_id,
        email: tijelo.email,
        adresa: tijelo.adresa || null,
        status: tijelo.status || null,
        broj_telefona: tijelo.broj_telefona || null,
        datum_rodenja: tijelo.datum_rodenja || null
    };
    
  
      try {
          await this.kdao.dodaj(korisnik);
          odgovor.status(201).send({ status: "uspjeh" });
      } catch (err) {
          console.error("Greška pri unosu korisnika:", err);
          odgovor.status(400).send({ greska: "Greška pri unosu korisnika" });
      }
  }

  async postLogin(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    const tijelo = zahtjev.body;
    if (!tijelo.korime || !tijelo.lozinka) {
        odgovor.status(400).send({ greska: "Nedostaju obavezni podaci: korisničko ime i/ili lozinka" });
        return;
    }
    try {
        const korisnik = await this.kdao.prijaviKorisnika(tijelo.korime, kreirajSHA256(tijelo.lozinka, "moja sol"));
        if (korisnik) {
            zahtjev.session.tip_korisnika_id = korisnik.tip_korisnika_id;
            zahtjev.session.korime = korisnik.korime;
            zahtjev.session.korisnik = korisnik.korisnik;
            odgovor.status(201).send({
                status: "uspjeh",
                korisnik: {
                    ime: korisnik.ime,
                    prezime: korisnik.prezime,
                    email: korisnik.email,
                    korime: korisnik.korime,
                    tip_korisnika_id: korisnik.tip_korisnika_id,
                },
            });
        } else {
            odgovor.status(401).send({ greska: "Neispravno korisničko ime ili lozinka" });
        }
    } catch (err) {
        console.error("Greška pri provjeri korisnika:", err);
        odgovor.status(400).send({ greska: "Greška na serveru" });
    }
  }

  postKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  deleteKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    const korime = zahtjev.params["korime"];
    if (!korime) {
        odgovor.status(400).send({ greska: "Nedostaje korime!" });
        return;
    }

    this.kdao
        .daj(korime)
        .then((korisnik) => {
            if (!korisnik) {
                odgovor.status(400).send({ greska: `Korisnik s korisničkim imenom ${korime} ne postoji.` });
                return;
            }

            return this.kdao
                .obrisi(korime)
                .then(() => {
                    odgovor.status(201).send({ poruka: `Korisnik ${korime} je obrisan.` });
                })
                .catch((err) => {
                    console.error("Greška pri brisanju korisnika:", err);
                    odgovor.status(400).send({ greska: "Greška pri brisanju korisnika." });
                });
        })
        .catch((err) => {
            console.error("Greška pri provjeri korisnika:", err);
            odgovor.status(400).send({ greska: "Greška pri provjeri korisnika." });
        });
}

}