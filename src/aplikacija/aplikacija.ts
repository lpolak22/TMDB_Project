import express from "express";
import sesija from 'express-session'
import kolacici from 'cookie-parser'
import { __dirname, dajPort, dajPortSevis } from "../zajednicko/esmPomocnik.js";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { HtmlUpravitelj } from "./htmlUpravitelj.js"
import { RestKorisnik } from "./restKorisnik.js";
import path from "path";
import cors from "cors";

const server = express();
let konf = new Konfiguracija();
let portRest : number;

let port = 12222;

declare module "express-session" {
  export interface SessionData {
    korisnik: any;
    korime: string;
    tip_korisnika_id: number;
  }
}

konf
  .ucitajKonfiguraciju()
  .then(pokreniServer)
  .catch((greska: Error | any) => {
    if (process.argv.length == 2)
      console.error("Potrebno je dati naziv datoteke");
    else if (greska.path != undefined)
      console.error("Nije moguće otvoriti datoteku: " + greska.path);
    else console.log(greska.message);
    process.exit();
  });

  if(process.argv[3] && process.argv[3] !== ""){
    portRest = parseInt(process.argv[3]);
  }
  else{
    portRest = dajPortSevis("lpolak22");
  }
  
  if (process.argv[4] && process.argv[4] !== "") {
    port = parseInt(process.argv[4]);
  }
  else {
    port = dajPort("lpolak22");
  }

function pokreniServer() {
  server.use(kolacici());
  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use(
	cors({
		origin: function (origin, povratniPoziv) {
			if (
				!origin ||
				origin.startsWith("http://spider.foi.hr:") ||
				origin.startsWith("http://localhost:")
			) {
				povratniPoziv(null, true);
			} else {
				povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
			}
		},
		optionsSuccessStatus: 200,
	})
);
  server.use(sesija({
     secret: konf.dajKonf().tajniKljucSesija,
     saveUninitialized: true,
     cookie: {  maxAge: 1000 * 60 * 60 * 3 },
     resave: false
  }));
  
  server.use("/js", express.static(path.join(__dirname(), "/jsk")));
  server.use("/css", express.static(path.join(__dirname(), "css")));
  server.use("/dok", express.static(path.join(__dirname(), "../../dokumentacija")));
  pripremiPutanjePocetna();
  pripremiPutanjeAutentifikacija();
  pripremiPutanjeDokumentacija();
  pripremiPutanjeProcesRegistracije();
  pripremiPutanjeOsobe();

  server.use((zahtjev, odgovor) => {
    odgovor.status(404);
    var poruka = "<!DOCTYPE html><html lang=hr><head><title>ERROR</title><meta charset=UTF-8><head><body><h1>Stranica nije pronađena!</h1></body></html>";
    odgovor.send(poruka);
  });

  server.listen(port, () => {
    console.log("port rest: ", portRest);
    
    console.log(`Server pokrenut na portu: ${port}`);
  });
}

function pripremiPutanjePocetna() {
	let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc, port);
  server.get("/", htmlUpravitelj.pocetna.bind(htmlUpravitelj));
}

function pripremiPutanjeAutentifikacija() {
  let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc,port);
  server.get("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
  server.post("/registracija", htmlUpravitelj.registracija.bind(htmlUpravitelj));
  server.get("/odjava", htmlUpravitelj.odjava.bind(htmlUpravitelj));
  server.get("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
  server.post("/prijava", htmlUpravitelj.prijava.bind(htmlUpravitelj));
}

function pripremiPutanjeDokumentacija() {
  let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc, port);
  server.get("/dokumentacija", htmlUpravitelj.dokumentacija.bind(htmlUpravitelj));
}

function pripremiPutanjeProcesRegistracije() {
  let restKorisnik = new RestKorisnik();
  server.post("/aplikacijaLP/registracija", restKorisnik.postKorisnici.bind(restKorisnik));
}

function pripremiPutanjeOsobe() {
  let htmlUpravitelj = new HtmlUpravitelj(konf.dajKonf().jwtTajniKljuc, port);
  server.get("/osobe", htmlUpravitelj.osobe.bind(htmlUpravitelj));
}
