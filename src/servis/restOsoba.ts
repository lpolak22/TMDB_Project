import { OsobaDAO } from "./osobaDAO.js";
import { Request, Response } from "express";

export class RestOsoba {
  private oDao;

  constructor() {
    this.oDao = new OsobaDAO();
  }
  
   postOsobe(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  deleteOsobe(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  putOsobe(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  async postOsoba(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    let podaci = zahtjev.body;

    if (!podaci.id || !podaci.ime_prezime || !podaci.poznat_po || !podaci.slika) {
        odgovor.status(400).send({ greska: "svi podaci su obavezni" });
        return;
    }

    try {
        let postojiOsoba = await this.oDao.daj(podaci.id);
        if (postojiOsoba) {
            odgovor.status(400).send({ greska: "Osoba već postoji" });
            return;
        }

        this.oDao.dodaj(podaci);
        odgovor.status(201).send({ status: "uspjeh"});
    } catch (error) {
        odgovor.status(400).send({ greska: "greska pri dodavanju osobe" });
    }
}


async getOsoba(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    let id = zahtjev.params["id"];
    
    if (!id) {
      odgovor.status(400).send({ greska: "ID je obavezan parametar" });
      return;
    }

    let idBroj = parseInt(id, 10);
    if (isNaN(idBroj)) {
      odgovor.status(400).send({ greska: "ID mora biti broj" });
      return;
    }

    try {
      let korisnik = await this.oDao.daj(idBroj);
      
      if (!korisnik) {
        odgovor.status(404).send({ greska: "nepostojeći resurs" });
        return;
      }

      odgovor.status(200).send(korisnik);
    } catch (greska) {
      odgovor.status(400).send({ greska: "greska" });
    }
  }


async deleteOsoba(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    
    let id = zahtjev.params["id"];
    
    if (!id) {
        odgovor.status(400).send({ greska: "ID je obavezan" });
        return;
    }

    let idBroj = parseInt(id, 10);
    if (isNaN(idBroj)) {
        odgovor.status(400).send({ greska: "ID mora biti broj" });
        return;
    }
    
    try {
        let korisnik = await this.oDao.daj(idBroj);
        if (!korisnik) {
            odgovor.status(400).send({ greska: "nemoguce brisanje" });
            return;
        }

        let uspjeh = await this.oDao.obrisi(idBroj);
        if (uspjeh) {
            odgovor.status(201).send({ status: "uspjeh"});
        } else {
            odgovor.status(400).send({ greska: "osoba nije obrisana" });
        }
    } catch (greska) {
        odgovor.status(400).send({ greska: "greska prilikom brisanja" });
    }
}



  async putOsoba(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  }

  async getOsobePoStranici(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    const dozvoljeniParametri = ["stranica"];
    const sviParametri = Object.keys(zahtjev.query);

    const neocekivaniParametri = sviParametri.filter(
        (param) => !dozvoljeniParametri.includes(param)
    );

    if (neocekivaniParametri.length > 0) {
        odgovor.status(422).send({ greska: "neocekivani podaci" });
        return;
    }

    const stranica = parseInt(zahtjev.query["stranica"] as string, 10);
    
    if (isNaN(stranica) || stranica < 1) {
        try {
            const osobe = await this.oDao.dajSve();
            odgovor.status(200).send(osobe);
        } catch (greska) {
            odgovor.status(400).send({ greska: "Greška pri dohvatu svih osoba" });
        }
        return;
    }

    const brojElemenata = 20;
    const offset = (stranica - 1) * brojElemenata;

    try {
        const osobe = await this.oDao.dajSveStranica(offset, brojElemenata);

        if (osobe.length === 0) {
            odgovor.status(200).send([]);
            return;
        }

        odgovor.status(200).send(osobe);
    } catch (greska) {
        odgovor.status(400).send({ greska: "greska kod dohvata osoba po stranici" });
    }
}

  
}