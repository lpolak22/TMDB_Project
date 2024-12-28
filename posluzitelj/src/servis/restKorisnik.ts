import { KorisnikDAO } from "./korisnikDAO.js";
import { Request, Response } from "express";
import * as kodovi from "../zajednicko/kodovi.js"

export class RestKorisnik {
  private kdao;

  constructor() {
    this.kdao = new KorisnikDAO();
  }

  async postKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    let tijelo = zahtjev.body;

    if (
        !tijelo.korime ||
        !tijelo.lozinka ||
        !tijelo.email
    ) {
        odgovor.status(400).send({ greska: "nedostaju obavezni podaci" });
        return;
    }

    const korisnik = {
        ime: tijelo.ime || null,
        prezime: tijelo.prezime || null,
        korime: tijelo.korime,
        lozinka: kodovi.kreirajSHA256(tijelo.lozinka, "moja sol"),
        tip_korisnika_id: 2,
        email: tijelo.email,
        adresa: tijelo.adresa || null,
        status: 0,
        broj_telefona: tijelo.broj_telefona || null,
        datum_rodenja: tijelo.datum_rodenja || null,
    };

    try {
        let korisnikPostoji = await this.kdao.postojiKorisnik(korisnik.korime);
        if (korisnikPostoji) {
            odgovor.status(400).send({
                greska: "korisnik s ovim korisničkim imenom već postoji",
            });
            return;
        }

        this.kdao.dodaj(korisnik);
        odgovor.status(201).send({ status: "uspjeh" });
    } catch (err) {
        console.error("greska pri unosu korisnika:", err);
        odgovor.status(400).send({ greska: "greska pri unosu korisnika" });
    }
}

  deleteKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  putKorisnici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
		odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  postKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  deleteKorisnik(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
  
    let korime = zahtjev.params["korime"];
    
    if (!korime) {
      odgovor.status(400).send({ greska: "nedostaje korime!" });
      return;
    }

    this.kdao.daj(korime)
      .then((korisnik) => {
        if (!korisnik) {
          odgovor.status(400).send({ greska: "korisnik ne postoji" });
          return;
        }
  
        return this.kdao.obrisi(korime)
          .then(() => {
            odgovor.status(201).send({ poruka: "uspjeh" });
          })
          .catch((err) => {
            console.error("greska pri brisanju korisnika:", err);
            odgovor.status(400).send({ greska: "greska pri brisanju korisnika" });
          });
      })
      .catch((err) => {
        console.error("greska pri provjeri korisnika:", err);
        odgovor.status(400).send({ greska: "greska pri provjeri korisnika" });
      });
  }
  async postLogin(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
  
    const { korime, lozinka } = zahtjev.body;
  
    if (!korime || !lozinka) {
      odgovor.status(400).send({ greska: "Nedostaju obavezni podaci: korisničko ime i/ili lozinka" });
      return;
    }
  
    try {
      const korisnik = await this.kdao.prijaviKorisnika(korime, kodovi.kreirajSHA256(lozinka, "moja sol"));
  
      if (korisnik) {
        zahtjev.session.korisnik = {
        korime: korisnik.korime,
        tip_korisnika_id: korisnik.tip_korisnika_id
      };
        odgovor.status(200).send({
          korime: korisnik.korime,
          tip_korisnika_id: korisnik.tip_korisnika_id
        });
      } else {
        odgovor.status(401).send({ greska: "Neispravno korisničko ime ili lozinka" });
      }
    } catch (err) {
      console.error("Greška pri provjeri korisnika:", err);
      odgovor.status(400).send({ greska: "Pogreška na poslužitelju" });
    }
  }
  
  async getPocetna(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
  
    const korime = zahtjev.session?.korisnik?.korime;
  
    if (!korime) {
      odgovor.status(400).send({ greska: "Nedostaje korime ime u sesiji" });
      return;
    }
  
    try {
      const korisnik = await this.kdao.daj(korime);
      
      if (!korisnik) {
        odgovor.status(400).send({ greska: "ne postoji korisnik" });
        return;
      }
      odgovor.status(200).send(korisnik);
    } catch (err) {
      console.error("greska kod dohvacanje podataka za pocetnu:", err);
      odgovor.status(400).send({ greska: "pogreska na posluzitelju" });
    }
  }
  async postZahtjev(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    
  }
}
