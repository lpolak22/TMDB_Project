import { OsobaFilmDAO } from './osobaFilmDAO.js';
export class RestOsobaFilm {
    osobaFilmDao;
    constructor() {
        this.osobaFilmDao = new OsobaFilmDAO();
    }
    async getOsobaFilm(zahtjev, odgovor) {
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
        let stranicaBroj = parseInt(stranica ?? '1', 10);
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
        }
        catch (greska) {
            odgovor.status(500).send({ greska: "Greška pri dohvaćanju filmova" });
        }
    }
    async putOsobaFilm(zahtjev, odgovor) {
        odgovor.type('application/json');
        let idOsoba = zahtjev.params['id'];
        if (!idOsoba) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
        let idOsobe = parseInt(idOsoba, 10);
        if (isNaN(idOsobe)) {
            odgovor.status(400).send({ greska: "ID mora biti broj" });
            return;
        }
        let filmovi = zahtjev.body.filmovi;
        console.log(filmovi);
        if (!filmovi) {
            let film = zahtjev.body;
            if (!film || typeof film.id !== 'number' || typeof film.lik !== 'string') {
                odgovor.status(400).send({ greska: "Film mora sadržavati 'id' i 'lik' kao valjane vrednosti" });
                return;
            }
            filmovi = [film];
        }
        else if (!Array.isArray(filmovi)) {
            odgovor.status(400).send({ greska: "pogresan format podataka" });
            return;
        }
        try {
            for (let film of filmovi) {
                let { id, lik } = film;
                if (!id || typeof lik !== 'string') {
                    odgovor.status(400).send({ greska: "Film mora sadržavati 'id' i 'lik' kao valjane vrijednosti" });
                    return;
                }
            }
            await this.osobaFilmDao.poveziOsobuSaFilmovima(idOsobe, filmovi);
            odgovor.status(200).send({ poruka: "Osoba uspješno povezana s filmovima" });
        }
        catch (greska) {
            odgovor.status(500).send({ greska: "Greška pri povezivanju osobe s filmovima" });
        }
    }
    async deleteOsobaFilm(zahtjev, odgovor) {
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
        }
        catch (greska) {
            if (greska instanceof Error && greska.message === "Greška: nepostojeća veza") {
                odgovor.status(404).send({ greska: "Veza nije pronađena" });
            }
            else {
                odgovor.status(400).send({ greska: "Greška pri brisanju veze osobe na film" });
            }
        }
    }
}
