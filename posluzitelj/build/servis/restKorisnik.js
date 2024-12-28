import { KorisnikDAO } from "./korisnikDAO.js";
import * as kodovi from "../zajednicko/kodovi.js";
export class RestKorisnik {
    kdao;
    constructor() {
        this.kdao = new KorisnikDAO();
    }
    async postKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        let tijelo = zahtjev.body;
        if (!tijelo.korime ||
            !tijelo.lozinka ||
            !tijelo.email) {
            odgovor.status(400).send({ greska: "nedostaju obavezni podaci" });
            return;
        }
        const korisnik = {
            ime: tijelo.ime || null,
            prezime: tijelo.prezime || null,
            korime: tijelo.korime,
            lozinka: kodovi.kreirajSHA256(tijelo.lozinka, "moja sol"),
            tip_korisnika_id: 2,
            email: tijelo.email,
            adresa: tijelo.adresa || null,
            status: tijelo.status || null,
            broj_telefona: tijelo.broj_telefona || null,
            datum_rodenja: tijelo.datum_rodenja || null,
        };
        try {
            let korisnikPostoji = await this.kdao.postojiKorisnik(korisnik.korime);
            if (korisnikPostoji) {
                odgovor.status(400).send({
                    greska: "korisnik s ovim korisničkim imenom već postoji",
                });
                return;
            }
            this.kdao.dodaj(korisnik);
            odgovor.status(201).send({ status: "uspjeh" });
        }
        catch (err) {
            console.error("greska pri unosu korisnika:", err);
            odgovor.status(400).send({ greska: "greska pri unosu korisnika" });
        }
    }
    deleteKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    }
    ;
    putKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    }
    ;
    postKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    }
    ;
    deleteKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        let korime = zahtjev.params["korime"];
        if (!korime) {
            odgovor.status(400).send({ greska: "nedostaje korime!" });
            return;
        }
        this.kdao.daj(korime)
            .then((korisnik) => {
            if (!korisnik) {
                odgovor.status(400).send({ greska: "korisnik ne postoji" });
                return;
            }
            return this.kdao.obrisi(korime)
                .then(() => {
                odgovor.status(201).send({ poruka: "uspjeh" });
            })
                .catch((err) => {
                console.error("greska pri brisanju korisnika:", err);
                odgovor.status(400).send({ greska: "greska pri brisanju korisnika" });
            });
        })
            .catch((err) => {
            console.error("greska pri provjeri korisnika:", err);
            odgovor.status(400).send({ greska: "greska pri provjeri korisnika" });
        });
    }
    async postLogin(zahtjev, odgovor) {
        odgovor.type("application/json");
        const { korime, lozinka } = zahtjev.body;
        if (!korime || !lozinka) {
            odgovor.status(400).send({ greska: "Nedostaju obavezni podaci: korisničko ime i/ili lozinka" });
            return;
        }
        try {
            const korisnik = await this.kdao.prijaviKorisnika(korime, kodovi.kreirajSHA256(lozinka, "moja sol"));
            if (korisnik) {
                zahtjev.session.korisnik = korisnik;
                odgovor.status(200).send({
                    ime: korisnik.ime,
                    prezime: korisnik.prezime,
                    email: korisnik.email,
                    korime: korisnik.korime,
                    tip_korisnika_id: korisnik.tip_korisnika_id,
                    adresa: korisnik.adresa,
                    status: korisnik.status,
                    broj_telefona: korisnik.broj_telefona,
                    datum_rodenja: korisnik.datum_rodenja
                });
            }
            else {
                odgovor.status(401).send({ greska: "Neispravno korisničko ime ili lozinka" });
            }
        }
        catch (err) {
            console.error("Greška pri provjeri korisnika:", err);
            odgovor.status(400).send({ greska: "Pogreška na poslužitelju" });
        }
    }
}
