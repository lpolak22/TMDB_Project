import { SlikaDAO } from "./slikaDAO.js";
export class RestSlika {
    sDao;
    constructor() {
        this.sDao = new SlikaDAO();
    }
    async postSlika(zahtjev, odgovor) {
        odgovor.type("application/json");
        let podaci = zahtjev.body;
        if (!podaci.osoba_id) {
            odgovor.status(400).send({ greska: "svi podaci su obavezni" });
            return;
        }
        try {
            this.sDao.dodaj(podaci);
            odgovor.status(201).send({ status: "uspjeh" });
        }
        catch (error) {
            odgovor.status(400).send({ greska: "greska pri dodavanju slike" });
        }
    }
    async deleteSlika(zahtjev, odgovor) {
        odgovor.type("application/json");
        let id = zahtjev.params["osoba_id"];
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
            let uspjeh = await this.sDao.obrisi(idBroj);
            if (uspjeh) {
                odgovor.status(201).send({ status: "uspjeh" });
            }
            else {
                odgovor.status(400).send({ greska: "Slike nisu obrisane" });
            }
        }
        catch (greska) {
            odgovor.status(400).send({ greska: "Greška prilikom brisanja" });
        }
    }
    async getSveSlike(zahtjev, odgovor) {
        odgovor.type("application/json");
        const osobaId = zahtjev.params["osoba_id"];
        try {
            const slike = await this.sDao.daj(Number(osobaId));
            if (slike.length === 0) {
                odgovor.status(200).send([]);
            }
            else {
                odgovor.status(200).send(slike);
            }
        }
        catch (err) {
            odgovor.status(400).send({ greska: "greška kod dohvaćanja podataka svih slika" });
        }
    }
}
