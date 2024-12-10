export class TMDBklijent {
    bazicniURL = "https://api.themoviedb.org/3";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    async dohvatiOsobe(stranica = 1) {
        const resurs = "/person/popular";
        const parametri = { page: stranica };
        const odgovor = await this.obaviZahtjev(resurs, parametri);
        const json = JSON.parse(odgovor);
        return json.results;
    }
    async dohvatiOsobu(id) {
        let resurs = "/person/" + id;
        let odgovor = await this.obaviZahtjev(resurs);
        return JSON.parse(odgovor);
    }
    async pretraziFilmovePoNazivu(trazi, stranica) {
        let resurs = "/search/movie";
        let parametri = { sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async pretraziOsobePoImenu(trazi, stranica) {
        let resurs = "/search-person";
        let parametri = { sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor);
    }
    async obaviZahtjev(resurs, parametri = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for (let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
}
