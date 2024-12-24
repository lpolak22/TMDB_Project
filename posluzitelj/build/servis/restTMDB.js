import { TMDBklijent } from "./klijentTMDB.js";
export class RestTMDB {
    tmdbKlijent;
    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
    }
    getOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        const imeParam = zahtjev.query["ime"];
        const stranicaParam = parseInt(zahtjev.query["stranica"], 10) || 1;
        if (!imeParam || imeParam.toString().trim() === "") {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
        const ime = imeParam.toString();
        this.tmdbKlijent
            .pretraziOsobePoImenu(ime, stranicaParam)
            .then(({ osobe, ukupnoStranica }) => {
            if (!osobe || osobe.length === 0) {
                odgovor.status(422).send({ greska: "neočekivani podaci" });
                return;
            }
            odgovor.status(200).json({
                ukupnoOsoba: osobe.length,
                ukupnoStranica: ukupnoStranica,
                osobe: osobe,
                trenutnaStranica: stranicaParam,
            });
        })
            .catch((greska) => {
            console.error("Greška prilikom pretrage osoba:", greska);
            odgovor.status(400).json({ greska: "pogreska prilikom dohvata osoba" });
        });
    }
    async getFilmoviOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        const idParam = zahtjev.params["id"];
        if (!idParam || isNaN(Number(idParam))) {
            odgovor.status(422).send({ greska: "Neočekivani podaci: ID nije ispravan" });
            return;
        }
        const osobaId = parseInt(idParam, 10);
        try {
            const filmovi = await this.tmdbKlijent.dohvatiFilmoveOsobe(osobaId);
            odgovor.status(200).json({
                osobaId: osobaId,
                filmovi: filmovi.length > 0 ? filmovi : [],
            });
        }
        catch (greska) {
            console.error("Greška prilikom dohvata filmova za osobu:", greska);
            odgovor.status(400).json({ greska: "Greška prilikom dohvata filmova" });
        }
    }
}
