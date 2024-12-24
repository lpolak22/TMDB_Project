import { FilmDAO } from "./filmDAO.js";
import { Request, Response } from "express";

export class RestFilm {
  private fDao;

  constructor() {
    this.fDao = new FilmDAO();
  }

//   async getFilmovi(zahtjev: Request, odgovor: Response) {
//     odgovor.type("application/json");

//     try {
//         const { datumOd, datumDo, stranica } = zahtjev.query;

//         const dozvoljeniParametri = ["datumOd", "datumDo", "stranica"];
//         const sviParametri = Object.keys(zahtjev.query);

//         const neocekivaniParametri = sviParametri.filter(param => !dozvoljeniParametri.includes(param));

//         if (neocekivaniParametri.length > 0) {
//             odgovor.status(422).send({ greska: "neočekivani podaci" });
//             return;
//         }

//         let stranicaBroj = parseInt(stranica as string, 10) || 1;
//         const brojElemenata = 20; 
//         if (stranicaBroj < 1) {
//             odgovor.status(400).send({ greska: "broj stranice mora biti veći od 0" });
//             return;
//         }

//         let offset = (stranicaBroj - 1) * brojElemenata;

//         let datumOdParsed: Date | null = null;
//         let datumDoParsed: Date | null = null;

//         const sada = new Date(); 

//         if (datumOd) {
//             datumOdParsed = this.pretvoriUDate(datumOd as string);
//         }

//         if (datumDo) {
//             datumDoParsed = this.pretvoriUDate(datumDo as string);
//         }

//         if (!datumOd && !datumDo) {
//             odgovor.status(422).send({ greska: "neočekivani podaci" });
//             return;
//         }

//         if (!datumOdParsed) datumOdParsed = new Date(0);
//         if (!datumDoParsed) datumDoParsed = sada;

//         try {
//             const filmovi = await this.fDao.dajFilmovePoDatumuSaStranica(
//                 datumOdParsed,
//                 datumDoParsed,
//                 offset,
//                 brojElemenata
//             );

//             if (filmovi.length === 0) {
//                 odgovor.status(404).send({ greska: "nepostojeći resurs" });
//                 return;
//             }

//             odgovor.status(200).send(filmovi);
//         } catch (greska) {
//             odgovor
//                 .status(400)
//                 .send({ greska: "greška pri dohvaćanju filmova" });
//         }
//     } catch (greska) {
//         odgovor
//             .status(400)
//             .send({ greska: "greška u unosu datuma" });
//     }
// }

async getSviFilmovi(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    try {
        const { stranica, datumOd, datumDo } = zahtjev.query;

        const dozvoljeniParametri = ["stranica", "datumOd", "datumDo"];
        const sviParametri = Object.keys(zahtjev.query);

        const neocekivaniParametri = sviParametri.filter(param => !dozvoljeniParametri.includes(param));

        if (neocekivaniParametri.length > 0) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }

        let stranicaBroj = 1;
        const brojElemenata = 20;

        if (stranica) {
            stranicaBroj = parseInt(stranica as string, 10);
            if (isNaN(stranicaBroj) || stranicaBroj < 1) {
                odgovor.status(400).send({ greska: "broj stranice mora biti pozitivan broj" });
                return;
            }
        }

        let offset = (stranicaBroj - 1) * brojElemenata;

        let datumOdParsed: Date | null = null;
        let datumDoParsed: Date | null = null;

        if (datumOd) {
            datumOdParsed = new Date(parseInt(datumOd as string, 10));
            if (isNaN(datumOdParsed.getTime())) {
                odgovor.status(400).send({ greska: "neispravan datumOd" });
                return;
            }
        }

        if (datumDo) {
            datumDoParsed = new Date(parseInt(datumDo as string, 10));
            if (isNaN(datumDoParsed.getTime())) {
                odgovor.status(400).send({ greska: "neispravan datumDo" });
                return;
            }
        }

        if (!datumOdParsed) datumOdParsed = new Date(0);
        if (!datumDoParsed) datumDoParsed = new Date();

        const filmovi = await this.fDao.dajFilmovePoDatumuSaStranica(
            datumOdParsed,
            datumDoParsed,
            offset,
            brojElemenata
        );

        if (filmovi.length === 0) {
            odgovor.status(200).send([]);
            return;
        }

        odgovor.status(200).send(filmovi);
    } catch (greska) {
        console.error("greska pri dohvacanju filmova:", greska);
        odgovor.status(400).send({ greska: "doslo je do greške na serveru" });
    }
}

// private pretvoriUDate(datum: string): Date {
//     if (/^\d+$/.test(datum)) {
//         return new Date(parseInt(datum, 10));
//     }

//     return new Date(datum);
// }


   postFilmovi(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  deleteFilmovi(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  putFilmovi(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  };

  async postFilm(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");

    let podaci = zahtjev.body;

    if (!podaci.jezik || !podaci.originalni_naslov || !podaci.naslov) {
        odgovor.status(400).send({ greska: "svi podaci su obavezni" });
        return;
    }

    try {
        const uspjeh = await this.fDao.dodaj(podaci);

        if (uspjeh) {
            odgovor.status(201).send({ status: "uspjeh" });
        } else {
            odgovor.status(400).send({ greska: "neuspješno dodavanje filma" });
        }
    } catch (error) {
        console.error("Greška pri dodavanju filma:", error);
        odgovor.status(400).send({ greska: "greska pri dodavanju filma" });
    }
}



async getFilm(zahtjev: Request, odgovor: Response) {
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
      let film = await this.fDao.daj(idBroj);
      
      if (!film) {
        odgovor.status(404).send({ greska: "nepostojeći resurs" });
        return;
      }

      odgovor.status(200).send(film);
    } catch (greska) {
      odgovor.status(400).send({ greska: "greška" });
    }
}



async deleteFilm(zahtjev: Request, odgovor: Response) {
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
        let film = await this.fDao.daj(idBroj);
        if (!film) {
            odgovor.status(404).send({ greska: "nepostojeći resurs" });
            return;
        }

        let povezaneOsobe = await this.fDao.dajOsobeZaFilm(idBroj);
        if (povezaneOsobe.length > 0) {
            odgovor.status(400).send({ greska: "neuspješno brisanje filma. Film je povezan s osobama." });
            return;
        }

        let uspjeh = await this.fDao.obrisi(idBroj);
        if (uspjeh) {
            odgovor.status(201).send({ status: "uspjeh" });
        } else {
            odgovor.status(400).send({ greska: "neuspjesno brisanje filma" });
        }
    } catch (greska) {
        odgovor.status(400).send({ greska: "greska prilikom brisanja" });
    }
}


  async putFilm(zahtjev: Request, odgovor: Response) {
    odgovor.type("application/json");
    odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
  }

//   async getFilmoviPoStranici(zahtjev: Request, odgovor: Response) {
//     odgovor.type("application/json");

//     let dozvoljeniParametri = ["stranica"];
//     let sviParametri = Object.keys(zahtjev.query);

//     let neocekivaniParametri = sviParametri.filter(
//         (param) => !dozvoljeniParametri.includes(param)
//     );

//     if (neocekivaniParametri.length > 0) {
//         odgovor
//             .status(422)
//             .send({ greska: "neočekivani podaci"});
//         return;
//     }

//     let stranica = parseInt(zahtjev.query["stranica"] as string, 10) || 1;
//     let brojElemenata = 20;

//     if (stranica < 1) {
//         odgovor
//             .status(400)
//             .send({ greska: "broj stranice mora biti veći od 0" });
//         return;
//     }

//     let offset = (stranica - 1) * brojElemenata;

//     try {
//         let osobe = await this.fDao.dajSveStranica(offset, brojElemenata);

//         if (osobe.length === 0) {
//             odgovor
//                 .status(404)
//                 .send({ greska: "nepostojeć resurs" });
//             return;
//         }

//         odgovor.status(200).send(osobe);
//     } catch (greska) {
//         odgovor
//             .status(400)
//             .send({ greska: "greška kod dohvaćanja podataka" });
//     }
// }
}