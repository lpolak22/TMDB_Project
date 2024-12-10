import { __dirname } from "../zajednicko/esmPomocnik.js";
import ds from "fs/promises";
import { ServisKlijent } from "./servisKlijent.js";
import { Request, Response } from "express";
import path from "path";
import { KorisnikDAO } from "./korisnikDAO.js";
import { kreirajSHA256 } from "../zajednicko/kodovi.js";

export class HtmlUpravitelj {
  private servisKlijent: ServisKlijent;
  private portAplikacija: number;

  constructor(tajniKljucJWT: string, portAplikacija: number) {
    this.servisKlijent = new ServisKlijent(portAplikacija);
    this.portAplikacija = portAplikacija;
  }

  async pocetna(zahtjev: Request, odgovor: Response) {

    if (!zahtjev.session.tip_korisnika_id) {
        odgovor.redirect("/prijava");
        return;
    }    

    let korisnik = zahtjev.session.korisnik;
    let pocetna = await this.ucitajStranicu("pocetna");

    pocetna = pocetna.replace("#ime#", korisnik.ime);
    pocetna = pocetna.replace("#prezime#", korisnik.prezime);
    pocetna = pocetna.replace("#adresa#", korisnik.adresa);
    pocetna = pocetna.replace("#korime#", korisnik.korime);
    pocetna = pocetna.replace("#email#", korisnik.email);
    pocetna = pocetna.replace("#broj_telefona#", korisnik.broj_telefona);
    pocetna = pocetna.replace("#datum_rodenja#", korisnik.datum_rodenja);

    let statusPoruka: string;
    if (korisnik.status === 0) {
        statusPoruka = "Nemate status";
    } else if (korisnik.status === 1) {
        statusPoruka = "Već imate status";
    } else {
        statusPoruka = "Ovo je neki novi tip, nije još obrađen";
    }
    pocetna = pocetna.replace("#status#", statusPoruka);
  
    odgovor.cookie("portAplikacija", this.portAplikacija, { httpOnly: false });
    odgovor.send(pocetna);
}


  async registracija(zahtjev: Request, odgovor: Response) {
    let greska = "";
    if (zahtjev.method == "POST") {
      let uspjeh = await this.servisKlijent.dodajKorisnika(zahtjev.body);
      console.log(uspjeh);
      
      if (uspjeh) {
        odgovor.redirect("/prijava");
        return;
      } else {
        greska = "Dodavanje nije uspjelo provjerite podatke!";
      }
    }

    let stranica = await this.ucitajStranicu("registracija", greska);
    odgovor.send(stranica);
  }

  async odjava(zahtjev: Request, odgovor: Response) {
    zahtjev.session.korisnik = null;
    zahtjev.session.destroy((err)=>{console.log("Sesija uništena! Error (ako ima je):"+err)})
    odgovor.redirect("/prijava");
  }

async prijava(zahtjev: Request, odgovor: Response) {

  let greska = "";
  if (zahtjev.method == "POST") {
    let kdao = new KorisnikDAO();

    const tijelo = zahtjev.body;
    if (!tijelo.korime || !tijelo.lozinka) {
        odgovor.status(400).send({ greska: "Nedostaju obavezni podaci: korisničko ime i/ili lozinka" });
        return;
    }
    try {
        const korisnik = await kdao.prijaviKorisnika(tijelo.korime, kreirajSHA256(tijelo.lozinka, "moja sol"));
        if (korisnik) {
          zahtjev.session.tip_korisnika_id = korisnik.tip_korisnika_id;
          zahtjev.session.korisnik = korisnik;

          let stranica = await this.ucitajStranicu("pocetna", greska);
          
          stranica = stranica.replace("#ime#", korisnik.ime);
          stranica = stranica.replace("#prezime#", korisnik.prezime);
          stranica = stranica.replace("#adresa#", korisnik.adresa);

          stranica = stranica.replace("#korime#", korisnik.korime);
          stranica = stranica.replace("#email#", korisnik.email);
          stranica = stranica.replace("#broj_telefona#", korisnik.broj_telefona);
          stranica = stranica.replace("#datum_rodenja#", korisnik.datum_rodenja);
          stranica = stranica.replace("#status#", korisnik.status);

          odgovor.send(stranica);
          return;
            
        } else {
            odgovor.status(401).send({ greska: "Neispravno korisničko ime ili lozinka" });
            return;
        }
    } catch (err) {
        console.error("Greška pri provjeri korisnika:", err);
        odgovor.status(400).send({ greska: "Greška na serveru" });
    }
  }
  
  const stranica = await this.ucitajStranicu("prijava", greska);
  odgovor.send(stranica);
}


  async dokumentacija(zahtjev: Request, odgovor: Response) {
    let stranica = await this.ucitajStranicu("dokumentacija");
    odgovor.send(stranica);
  }

  async osobe(zahtjev: Request, odgovor: Response) {
    let stranica = await this.ucitajStranicu("osobe");
    odgovor.send(stranica);
  }


  private async ucitajStranicu(nazivStranice: string, poruka = "") {

    let stranice: Promise<string>[];
    if (nazivStranice === "dokumentacija") {
        stranice = [
            this.ucitajHTMLDokumentacija(nazivStranice),
            this.ucitajHTML("navigacijaGost"),
        ];
    }
    else if (nazivStranice === "pocetna") {
      stranice = [
          this.ucitajHTML(nazivStranice),
          this.ucitajHTML("navigacijaKorisnik"),
      ];
  }
    else {
        stranice = [
            this.ucitajHTML(nazivStranice),
            this.ucitajHTML("navigacijaGost"),
        ];
    }
    let [stranica, nav] = await Promise.all(stranice);
    if (stranica != undefined && nav != undefined) {
      stranica = stranica.replace("#navigacija#", nav);
      stranica = stranica.replace("#navigacijaKorisnik#", nav);
      stranica = stranica.replace("#poruka#", poruka);
      return stranica;
    }
    return "";
  }

  private async ucitajHTML(htmlStranica: string) {
    return ds.readFile(
      __dirname() + "/html/" + htmlStranica + ".html",
      "utf-8",
    );
  }
  private async ucitajHTMLDokumentacija(htmlStranica: string) {
    return ds.readFile(
      path.join(__dirname(), "../../dokumentacija", htmlStranica + ".html"),
      "utf-8"
    );
    
  }
}
