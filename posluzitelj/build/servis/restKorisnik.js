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
        if (!tijelo.korisnik.korime ||
            !tijelo.korisnik.lozinka ||
            !tijelo.korisnik.email) {
            odgovor.status(400).send({ greska: "nedostaju obavezni podaci" });
            return;
        }
        const korisnik = {
            ime: tijelo.korisnik.ime || null,
            prezime: tijelo.korisnik.prezime || null,
            korime: tijelo.korisnik.korime,
            lozinka: kodovi.kreirajSHA256(tijelo.korisnik.lozinka, "moja sol"),
            tip_korisnika_id: 2,
            email: tijelo.korisnik.email,
            adresa: tijelo.korisnik.adresa || null,
            status: 1,
            broj_telefona: tijelo.korisnik.broj_telefona || null,
            datum_rodenja: tijelo.korisnik.datum_rodenja || null,
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
                zahtjev.session.korisnik = {
                    korime: korisnik.korime,
                    tip_korisnika_id: korisnik.tip_korisnika_id
                };
                odgovor.status(201).send({
                    korime: korisnik.korime,
                    tip_korisnika_id: korisnik.tip_korisnika_id
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
    async getPocetna(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.session?.korisnik?.korime;
        if (!korime) {
            odgovor.status(400).send({ greska: "Nedostaje korime ime u sesiji" });
            return;
        }
        try {
            const korisnik = await this.kdao.daj(korime);
            if (!korisnik) {
                odgovor.status(400).send({ greska: "ne postoji korisnik" });
                return;
            }
            odgovor.status(200).send(korisnik);
        }
        catch (err) {
            console.error("greska kod dohvacanje podataka za pocetnu:", err);
            odgovor.status(400).send({ greska: "pogreska na posluzitelju" });
        }
    }
    async getPodaciKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        try {
            const korisnici = await this.kdao.dajSve();
            if (korisnici.length === 0) {
                odgovor.status(200).send([]);
            }
            else {
                odgovor.status(200).send(korisnici);
            }
        }
        catch (err) {
            odgovor.status(400).send({ greska: "greska kod dohvacanja podataka svih korisnika" });
        }
    }
    async putPristup(zahtjev, odgovor) {
        odgovor.type("application/json");
        const { status } = zahtjev.body;
        const korime = zahtjev.params['korime'];
        if (!korime) {
            odgovor.status(400).send({ greska: "Nedostaju podaci za ažuriranje statusa korisnika." });
            return;
        }
        try {
            await this.kdao.azurirajKorisnika(korime, status);
            odgovor.status(201).send({ status: "uspjeh" });
        }
        catch (err) {
            odgovor.status(400).send({ greska: "pogreska kod azuriranja statusa korisnika" });
        }
    }
    async dodajKorisnika(zahtjev, odgovor) {
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
            status: 0,
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
            this.kdao.dodajKorisnik(korisnik);
            odgovor.status(201).send({ status: "uspjeh" });
        }
        catch (err) {
            console.error("greska pri unosu korisnika:", err);
            odgovor.status(400).send({ greska: "greska pri unosu korisnika" });
        }
    }
    async postZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
    }
}
