import * as kodovi from "../zajednicko/kodovi.js"

export class ServisKlijent {
    private portAplikacija:number;

    constructor(portAplikacija:number){
      this.portAplikacija=portAplikacija;
    }

    async dodajKorisnika(korisnik:{ime:string, prezime:string,lozinka:string,korime:string,email:string, adresa:string, status:number,broj_telefona:string, datum_rodenja:string, tip_korisnika:number}) {
        let tijelo = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            korime: korisnik.korime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol"),
            email: korisnik.email,
            adresa: korisnik.adresa,
            broj_telefona: korisnik.broj_telefona,
            datum_rodenja: korisnik.datum_rodenja,
            tip_korisnika: 2
        };

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        let odgovor = await fetch("http://localhost:" + this.portAplikacija + "/aplikacijaLP/registracija", parametri)

        if (odgovor.status == 201) {
            return true;
        } else {
            console.log(await odgovor.text());
            return false;
        }
    }
}
