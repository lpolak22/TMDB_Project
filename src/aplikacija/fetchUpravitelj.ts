import * as jwt from "../zajednicko/jwt.js";
import { Request, Response } from "express";
export class FetchUpravitelj {
  private tajniKljucJWT: string;

  constructor(tajniKljucJWT: string) {
    this.tajniKljucJWT = tajniKljucJWT;
  }

  async getJWT (zahtjev:Request, odgovor:Response) {
    odgovor.type("json");
    if (zahtjev.session.korime != null) {
      let k = { korime: zahtjev.session.korime };
      let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
      odgovor.send({ ok: noviToken });
      return;
    }
    odgovor.status(401);
    odgovor.send({ greska: "nemam token!" });
  };


}
