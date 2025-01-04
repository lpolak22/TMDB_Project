import { KorisnikDAO } from "./korisnikDAO.js";
import * as kodovi from "../zajednicko/kodovi.js";
import { kreirajTajniKljuc, provjeriTOTP } from "../zajednicko/totp.js";
import { TOTP } from "totp-generator";
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
            AktivnaDvoAut: 0,
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
                let dvaFA = await this.kdao.korisnikImaDvaFA(korime);
                if (dvaFA?.AktivnaDvoAut !== '1.0') {
                    this.stvoriSesiju(korisnik, zahtjev);
                    odgovor.status(201).send({
                        korime: korisnik.korime,
                        tip_korisnika_id: korisnik.tip_korisnika_id
                    });
                }
                else {
                    let tajniKljuc = await this.kdao.dajTOTP(korime);
                    if (Array.isArray(tajniKljuc) && tajniKljuc[0] && tajniKljuc[0].totp) {
                        const totpKod = TOTP.generate(tajniKljuc[0].totp, {
                            digits: 6,
                            algorithm: "SHA-512",
                            period: 60
                        });
                        console.log(`Generirani TOTP za korisnika ${korime}: ${totpKod.otp}`);
                    }
                    this.stvoriSesiju(korisnik, zahtjev);
                    odgovor.status(201).send({
                        korime: korisnik.korime,
                        tip_korisnika_id: korisnik.tip_korisnika_id,
                        test: 1
                    });
                }
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
    async stvoriSesiju(korisnik, zahtjev) {
        zahtjev.session.korisnik = {
            korime: korisnik.korime,
            tip_korisnika_id: korisnik.tip_korisnika_id
        };
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
            AktivnaDvoAut: 0,
            broj_telefona: tijelo.broj_telefona || null,
            datum_rodenja: tijelo.datum_rodenja || null,
        };
        try {
            let korisnikPostoji = await this.kdao.postojiKorisnikWeb(korisnik.korime);
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
    async putZahtjev(zahtjev, odgovor) {
        odgovor.type("application/json");
        const { status } = zahtjev.body;
        const korime = zahtjev.params['korime'];
        if (!korime) {
            odgovor.status(400).send({ greska: "nedostaju podaci za azuriranje statusa korisnika na pocetnoj" });
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
    async stvoriTOTP(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.body.korime;
        const AktivnaDvoAut = zahtjev.body.AktivnaDvoAut;
        const { deaktivacija } = zahtjev.body;
        if (!korime) {
            odgovor.status(400).send({ greska: "nema korime za totp azuriranje" });
            return;
        }
        try {
            if (deaktivacija) {
                await this.kdao.azurirajDvaFA(korime, AktivnaDvoAut);
                odgovor.status(201).send({ status: "uspjeh" });
            }
            else {
                const korisnik = await this.kdao.daj(korime);
                if (!korisnik) {
                    odgovor.status(400).send({ greska: "Korisnik ne postoji." });
                    return;
                }
                let tajniKljuc = await this.kdao.dajTOTP(korime);
                if (Array.isArray(tajniKljuc)) {
                    if (tajniKljuc[0].totp == null) {
                        let tajniTOTPkljuc = kreirajTajniKljuc(korime);
                        await this.kdao.azurirajTOTP(korime, tajniTOTPkljuc);
                        await this.kdao.azurirajDvaFA(korime, AktivnaDvoAut);
                    }
                    else {
                        await this.kdao.azurirajDvaFA(korime, AktivnaDvoAut);
                    }
                }
                odgovor.status(201).send({ status: "uspjeh" });
            }
        }
        catch (err) {
            console.error("Greška kod upravljanja totp:", err);
            odgovor.status(400).send({ greska: "greska kod azuriranje totp" });
        }
    }
    async provjeriTOTP(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.query['korime'];
        const totpKod = zahtjev.body.totpKod;
        if (!korime) {
            odgovor.status(400).send({ greska: "Nema korime za TOTP provjeru" });
            return;
        }
        try {
            const tajniKljuc = await this.kdao.dajTOTP(korime);
            if (Array.isArray(tajniKljuc) && tajniKljuc[0] && tajniKljuc[0].totp) {
                if (provjeriTOTP(totpKod, tajniKljuc[0].totp) == false)
                    return;
                if (tajniKljuc === null) {
                    odgovor.status(201).send({ tajniKljuc: null });
                }
                else {
                    odgovor.status(201).send({ tajniKljuc });
                }
            }
            else {
                odgovor.status(400).send({ greska: "Nema TOTP ključa" });
                return;
            }
        }
        catch (err) {
            odgovor.status(400).send({ greska: "Greška pri provjeri TOTP-a" });
        }
    }
    async dohvatiTOTP(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.query['korime'];
        if (!korime) {
            odgovor.status(400).send({ greska: "Nema korime za TOTP provjeru" });
            return;
        }
        try {
            const tajniKljuc = await this.kdao.dajTOTP(korime);
            if (tajniKljuc === null) {
                odgovor.status(200).send({ tajniKljuc: null });
            }
            else {
                odgovor.status(200).send({ tajniKljuc });
            }
        }
        catch (err) {
            odgovor.status(400).send({ greska: "Greška pri provjeri TOTP-a" });
        }
    }
    async provjeriDvaFA(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params['korime'];
        if (!korime) {
            odgovor.status(400).send({ greska: "Nema korime za 2FA provjeru" });
            return;
        }
        try {
            const dvaFA = await this.kdao.dajDvaFA(korime);
            if (dvaFA === null) {
                odgovor.status(400).send({ greska: "greska" });
            }
            else {
                odgovor.status(200).send({ dvaFA });
            }
        }
        catch (err) {
            odgovor.status(400).send({ greska: "Greška pri provjeri 2FA" });
        }
    }
    async getStatus(zahtjev, odgovor) {
        odgovor.type("application/json");
        const korime = zahtjev.params['korime'];
        if (!korime) {
            odgovor.status(400).send({ greska: "Nema korime za status provjeru" });
            return;
        }
        try {
            const status = await this.kdao.getStatus(korime);
            if (status === null) {
                odgovor.status(400).send({ greska: "greska" });
            }
            else {
                odgovor.status(200).send({ status });
            }
        }
        catch (err) {
            odgovor.status(400).send({ greska: "Greška pri provjeri 2FA" });
        }
    }
}
