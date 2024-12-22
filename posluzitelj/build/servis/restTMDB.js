import { TMDBklijent } from "./klijentTMDB.js";
export class RestTMDB {
    tmdbKlijent;
    constructor(api_kljuc) {
        this.tmdbKlijent = new TMDBklijent(api_kljuc);
    }
    getOsobe(zahtjev, odgovor) {
        odgovor.type("application/json");
        const imeParam = zahtjev.query["ime"];
        const stranicaParam = parseInt(zahtjev.query["stranica"], 10) || 1; // Dodavanje podrške za stranicu
        if (!imeParam || imeParam.toString().trim() === "") {
            odgovor.status(422).send({ greska: "Parametar 'ime' je obavezan za pretragu." });
            return;
        }
        const ime = imeParam.toString();
        this.tmdbKlijent
            .pretraziOsobePoImenu(ime, stranicaParam) // Prosljeđivanje stranice
            .then(({ osobe, ukupnoStranica }) => {
            if (!osobe || osobe.length === 0) {
                odgovor.status(404).send({ greska: "Nema rezultata za zadanu pretragu." });
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
            odgovor.status(400).json({ greska: "Greška prilikom pretrage osoba." });
        });
    }
}
