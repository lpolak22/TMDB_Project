import cors from "cors";
import express from "express";
import { dajPortSevis } from "../zajednicko/esmPomocnik.js";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { RestKorisnik } from "./restKorisnik.js";
import { RestFilm } from "./restFilm.js";
import { RestOsoba } from "./restOsoba.js";
import { RestOsobaFilm } from "./restOsobaFilm.js";
import { RestTMDB } from "./restTMDB.js";
//import { provjeriToken } from "../zajednicko/jwt.js";
const server = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
let port = 12222;
server.use(cors({
    origin: function (origin, povratniPoziv) {
        if (!origin ||
            origin.startsWith("http://spider.foi.hr:") ||
            origin.startsWith("http://localhost:")) {
            povratniPoziv(null, true);
        }
        else {
            povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
        }
    },
    optionsSuccessStatus: 200,
}));
let konf = new Konfiguracija();
konf
    .ucitajKonfiguraciju()
    .then(pokreniKonfiguraciju)
    .catch((greska) => {
    if (process.argv[2] === undefined)
        console.log("Potrebno je dati naziv datoteke");
    else if (greska.path != undefined)
        console.log("Nije moguće otvoriti datoteku " + greska.path);
    else
        console.log(greska.message);
    process.exit();
});
if (process.argv[3] && process.argv[3] !== "") {
    port = parseInt(process.argv[3]);
}
else {
    port = dajPortSevis("lpolak22");
}
function pokreniKonfiguraciju() {
    /*server.all("*", (zahtjev,odgovor,dalje) => {
        try{
            const token = provjeriToken(zahtjev, konf.dajKonf().jwtTajniKljuc);
            if(!token){
                odgovor.status(406).json({greska: "Token nije validan!"});
                return;
            }
            dalje();
        }
        catch(err){
            odgovor.status(422).json({greska: "Token je istekao!"});
        }
    });*/
    pripremiPutanjeResursKorisnika();
    pripremiPutanjeResursOsoba();
    pripremiPutanjeResursFilmova();
    pripremiPutanjeResursOsobaFilm();
    pripremiPutanjuTMDBdodavanje();
    server.use((zahtjev, odgovor) => {
        odgovor.type("application/json");
        odgovor.status(404).send({ greska: "nepostojeći resurs" });
    });
    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}
function pripremiPutanjeResursOsoba() {
    let restOsoba = new RestOsoba();
    server.get("/servis/osoba", restOsoba.getOsobePoStranici.bind(restOsoba));
    server.post("/servis/osoba", restOsoba.postOsoba.bind(restOsoba));
    server.put("/servis/osoba", restOsoba.putOsoba.bind(restOsoba));
    server.delete("/servis/osoba", restOsoba.deleteOsobe.bind(restOsoba));
    server.post("/servis/osoba/:id", restOsoba.postOsobe.bind(restOsoba));
    server.put("/servis/osoba/:id", restOsoba.putOsobe.bind(restOsoba));
    server.delete("/servis/osoba/:id", restOsoba.deleteOsoba.bind(restOsoba));
    server.get("/servis/osoba/:id", restOsoba.getOsoba.bind(restOsoba));
}
function pripremiPutanjeResursKorisnika() {
    let restKorisnik = new RestKorisnik();
    server.get("/servis/korisnici", (zahtjev, odgovor) => {
        odgovor.type("json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    });
    server.put("/servis/korisnici", restKorisnik.putKorisnici.bind(restKorisnik));
    server.delete("/servis/korisnici", restKorisnik.deleteKorisnici.bind(restKorisnik));
    server.post("/servis/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));
    server.get("/servis/korisnici/:korime", (zahtjev, odgovor) => {
        odgovor.type("json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    });
    server.post("/servis/korisnici/:korime", restKorisnik.postKorisnik.bind(restKorisnik));
    server.put("/servis/korisnici/:korime", (zahtjev, odgovor) => {
        odgovor.type("json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    });
    server.delete("/servis/korisnici/:korime", restKorisnik.deleteKorisnik.bind(restKorisnik));
}
function pripremiPutanjeResursFilmova() {
    let restFilm = new RestFilm();
    server.get("/servis/film/:id", restFilm.getFilm.bind(restFilm));
    server.post("/servis/film/:id", restFilm.postFilmovi.bind(restFilm));
    server.put("/servis/film/:id", restFilm.putFilmovi.bind(restFilm));
    server.delete("/servis/film/:id", restFilm.deleteFilm.bind(restFilm));
    server.get("/servis/film", restFilm.getSviFilmovi.bind(restFilm));
    server.post("/servis/film", restFilm.postFilm.bind(restFilm));
    server.put("/servis/film", restFilm.putFilm.bind(restFilm));
    server.delete("/servis/film", restFilm.deleteFilmovi.bind(restFilm));
}
function pripremiPutanjeResursOsobaFilm() {
    let restOsobaFilm = new RestOsobaFilm();
    server.get("/servis/osoba/:id/film", restOsobaFilm.getOsobaFilm.bind(restOsobaFilm));
    server.post("/servis/osoba/:id/film", (zahtjev, odgovor) => {
        odgovor.type("json");
        odgovor.status(405).send(JSON.stringify({ greska: "zabranjena metoda" }));
    });
    server.put("/servis/osoba/:id/film", restOsobaFilm.putOsobaFilm.bind(restOsobaFilm));
    server.delete("/servis/osoba/:id/film", restOsobaFilm.deleteOsobaFilm.bind(restOsobaFilm));
}
function pripremiPutanjuTMDBdodavanje() {
    let restTMDB = new RestTMDB(konf.dajKonf().tmdbApiKeyV3);
    server.get("/servis/app/dodavanje", restTMDB.getOsobe.bind(restTMDB));
    server.get("/servis/app/dodavanje/:id/filmovi", restTMDB.getFilmoviOsobe.bind(restTMDB));
    server.get("/servis/app/detalji/:id", restTMDB.getSlikeOsobe.bind(restTMDB));
}
