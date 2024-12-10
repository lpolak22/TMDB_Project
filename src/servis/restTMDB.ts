import { OsobaTmdbI } from "../servisI/tmdbI.js";
//import { dajNasumceBroj } from "../zajednicko/kodovi.js";
import { Request, Response } from "express";
import { TMDBklijent } from "./klijentTMDB.js";

export class RestTMDB {
  private tmdbKlijent:TMDBklijent;

  constructor(api_kljuc: string) {
    this.tmdbKlijent = new TMDBklijent(api_kljuc);
  }

  getOsoba(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
  
    const id = zahtjev.params["id"];
  
    if (!id || isNaN(Number(id))) {
      odgovor.status(422).send({ greska: "neočekivani podaci" });
      return;
    }
  
    this.tmdbKlijent
      .dohvatiOsobu(parseInt(id))
      .then((osoba: OsobaTmdbI) => {
        if (!osoba) {
          odgovor.status(400).send({ greska: "zabranjen pristup" });
          return;
        }
  
        odgovor.status(200).json(osoba);
      })
      .catch((greska) => {
        odgovor.status(400).json({ greska: "zabranjen pristup"});
      });
  }
  
  getOsobe(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    const stranicaParam = zahtjev.query["stranica"];
    const dopusteniParametri = ["stranica"];

    const parametriZahtjeva = Object.keys(zahtjev.query);
    const nepoznatiParametri = parametriZahtjeva.filter(
        (parametar) => !dopusteniParametri.includes(parametar)
    );

    if (nepoznatiParametri.length > 0) {
        odgovor.status(422).send({ greska: "neočekivani podaci" });
        return;
    }

    if (!stranicaParam || isNaN(Number(stranicaParam)) || Number(stranicaParam) <= 0) {
        odgovor.status(422).send({ greska: "neočekivani podaci" });
        return;
    }

    const stranica = parseInt(stranicaParam as string, 10);

    this.tmdbKlijent
        .dohvatiOsobe(stranica)
        .then((osobe: Array<OsobaTmdbI>) => {
            if (!osobe || osobe.length === 0) {
                odgovor.status(400).send({ greska: "zabranjen pristup" });
                return;
            }

            odgovor.status(200).json({
                stranica: stranica,
                ukupnoOsoba: osobe.length,
                osobe: osobe,
            });
        })
        .catch((greska) => {
            console.error("Greška prilikom dohvaćanja osoba:", greska);
            odgovor.status(400).json({ greska: "zabranjen pristup" });
        }); 
  }  
  
}