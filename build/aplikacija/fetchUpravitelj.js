import * as jwt from "../zajednicko/jwt.js";
export class FetchUpravitelj {
    tajniKljucJWT;
    constructor(tajniKljucJWT) {
        this.tajniKljucJWT = tajniKljucJWT;
    }
    async getJWT(zahtjev, odgovor) {
        odgovor.type("json");
        if (zahtjev.session.korime != null) {
            let k = { korime: zahtjev.session.korime };
            let noviToken = jwt.kreirajToken(k, this.tajniKljucJWT);
            odgovor.send({ ok: noviToken });
            return;
        }
        odgovor.status(401);
        odgovor.send({ greska: "nemam token!" });
    }
    ;
}
