import dsPromise from "fs/promises";
export class Konfiguracija {
    konf;
    constructor() {
        this.konf = this.initKonf();
    }
    initKonf() {
        return {
            jwtTajniKljuc: "",
            jwtValjanost: "",
            tajniKljucSesija: "",
            tmdbApiKeyV3: "",
            tmdbApiKeyV4: "",
            reCaptcha: "",
        };
    }
    dajKonf() {
        return this.konf;
    }
    async ucitajKonfiguraciju() {
        if (process.argv[2] == undefined)
            throw new Error("Nedostaje putanja do konfiguracijske datoteke");
        let putanja = process.argv[2];
        var podaci = await dsPromise.readFile(putanja, {
            encoding: "utf-8",
        });
        this.pretvoriJSONkonfig(podaci);
        console.log(this.konf);
        this.provjeriPodatkeKonfiguracije();
    }
    pretvoriJSONkonfig(podaci) {
        let konf = {};
        var nizPodataka = podaci.split("\n");
        for (let podatak of nizPodataka) {
            var podatakNiz = podatak.split("#");
            var naziv = podatakNiz[0];
            if (typeof naziv != "string" || naziv == "")
                continue;
            var vrijednost = podatakNiz[1] ?? "";
            konf[naziv] = vrijednost;
        }
        this.konf = konf;
    }
    provjeriPodatkeKonfiguracije() {
        if (this.konf.tmdbApiKeyV3 == undefined ||
            this.konf.tmdbApiKeyV3.trim() == "") {
            throw new Error("Fali TMDB API ključ u tmdbApiKeyV3");
        }
        if (this.konf.jwtValjanost == undefined ||
            this.konf.jwtValjanost.trim() == "") {
            throw new Error("Fali JWT valjanost");
        }
        if (this.konf.jwtTajniKljuc == undefined ||
            this.konf.jwtTajniKljuc.trim() == "") {
            throw new Error("Fali JWT tajni kljuc");
        }
        if (parseInt(this.konf.jwtValjanost) < 15 || parseInt(this.konf.jwtValjanost) > 300) {
            throw new Error("Jwt nije u raponu");
        }
        ;
        if (this.konf.jwtTajniKljuc.length < 100 || this.konf.jwtTajniKljuc.length > 200) {
            throw new Error("Tajni kljuc nije u rasponu.");
        }
        const regex = /^[a-z0-9!%$]{100,200}$/;
        if (!regex.test(this.konf.jwtTajniKljuc) || !regex.test(this.konf.tajniKljucSesija)) {
            throw new Error("Koristili ste nepodržane znakove");
        }
    }
}
