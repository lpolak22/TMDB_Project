import * as jwt from "../zajednicko/jwt.js";
import { Request, Response } from "express";
export class RestJWT {
  private tajniKljucJWT: string;

  constructor(tajniKljucJWT: string) {
    this.tajniKljucJWT = tajniKljucJWT;
  }

  async getJWT(zahtjev: Request, odgovor: Response) {
    odgovor.type("json");
    let sesija = zahtjev.session.korisnik;
    if (sesija != null) {
      let k = {
        korime: sesija.korime,
        tip_korisnika_id: sesija.tip_korisnika_id,
      };
      let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
      odgovor.send({ ok: noviToken });
      return;
    }
    odgovor.status(401);
    odgovor.send({ greska: "nemam token!" });
  }
}
