import { Request, Response } from 'express';
import { OsobaFilmDAO } from './osobaFilmDAO.js';

export class RestOsobaFilm {
  private osobaFilmDao: OsobaFilmDAO;

  constructor() {
    this.osobaFilmDao = new OsobaFilmDAO();
  }

  async getOsobaFilm(zahtjev: Request, odgovor: Response) {
    odgovor.type('application/json');

    let id = zahtjev.params['id'];
    let stranica = zahtjev.query['stranica'];

    if (!id) {
        odgovor.status(400).send({ greska: "ID osobe je obavezan" });
        return;
    }

    let dozvoljeniParametri = { stranica: true };
    for (let param in zahtjev.query) {
        if (!(param in dozvoljeniParametri)) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
    }

    let idOsobe = parseInt(id, 10);
    if (isNaN(idOsobe)) {
        odgovor.status(422).send({ greska: "ID mora biti broj" });
        return;
    }

    let stranicaBroj = parseInt(stranica as string ?? '1', 10);
    if (isNaN(stranicaBroj) || stranicaBroj < 1) {
        odgovor.status(422).send({ greska: "Stranica mora biti broj veći od 0" });
        return;
    }

    try {
        let filmovi = await this.osobaFilmDao.dajFilmoveZaOsobu(idOsobe, stranicaBroj);

        if (filmovi.length === 0) {
            odgovor.status(200).send([]);
            return;
        }

        odgovor.status(200).send(filmovi);
    } catch (greska) {
        odgovor.status(500).send({ greska: "Greška pri dohvaćanju filmova" });
    }
}
  
async putOsobaFilm(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    const id = parseInt(zahtjev.params["id"] || "0");
    const filmovi: Array<{ film_id: number; lik: string }> = zahtjev.body;

    if (!id || !Array.isArray(filmovi)) {
      odgovor.status(400).json({ greska: "Nedostaje ID osobe ili podaci o filmovima" });
      return;
    }

    try {
      await this.osobaFilmDao.poveziOsobuSaFilmovima(id, filmovi);
      odgovor.status(201).json({ status :"uspjeh" });
    } catch (err) {
      console.error("Greška prilikom povezivanja osobe s filmovima:", err);
      odgovor.status(500).json({ greska: "Greška prilikom povezivanja osobe s filmovima" });
    }
  }



async deleteOsobaFilm(zahtjev: Request, odgovor: Response) {
  odgovor.type('application/json');

  let idOsoba = zahtjev.params['id'];

  if (!idOsoba) {
      odgovor.status(400).send({ greska: "ID osobe je obavezan" });
      return;
  }

  let idOsobe = parseInt(idOsoba, 10);
  if (isNaN(idOsobe)) {
      odgovor.status(400).send({ greska: "ID mora biti broj" });
      return;
  }

  try {
      await this.osobaFilmDao.obrisiVezeOsobeNaFilmove(idOsobe);
      odgovor.status(201).send({ status: "uspjeh" });
  } catch (greska) {
      if (greska instanceof Error && greska.message === "Greška: nepostojeća veza") {
          odgovor.status(404).send({ greska: "Veza nije pronađena" });
      } else {
          odgovor.status(400).send({ greska: "Greška pri brisanju veze osobe na film" });
      }
  }
}

}
