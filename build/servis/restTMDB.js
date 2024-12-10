import { TMDBklijent } from "./klijentTMDB.js";
export class RestTMDB {
    tmdbKlijent;
    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
    }
    getOsoba(zahtjev, odgovor) {
        odgovor.type("application/json");
        const id = zahtjev.params["id"];
        if (!id || isNaN(Number(id))) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
        this.tmdbKlijent
            .dohvatiOsobu(parseInt(id))
            .then((osoba) => {
            if (!osoba) {
                odgovor.status(400).send({ greska: "zabranjen pristup" });
                return;
            }
            odgovor.status(200).json(osoba);
        })
            .catch((greska) => {
            odgovor.status(400).json({ greska: "zabranjen pristup" });
        });
    }
    getOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        const stranicaParam = zahtjev.query["stranica"];
        const dopusteniParametri = ["stranica"];
        const parametriZahtjeva = Object.keys(zahtjev.query);
        const nepoznatiParametri = parametriZahtjeva.filter((parametar) => !dopusteniParametri.includes(parametar));
        if (nepoznatiParametri.length > 0) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
        if (!stranicaParam || isNaN(Number(stranicaParam)) || Number(stranicaParam) <= 0) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
        const stranica = parseInt(stranicaParam, 10);
        this.tmdbKlijent
            .dohvatiOsobe(stranica)
            .then((osobe) => {
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
