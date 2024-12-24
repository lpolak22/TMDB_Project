export class TMDBklijent {
    bazicniURL = "https://api.themoviedb.org/3";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    // public async dohvatiOsobe(stranica: number): Promise<{ osobe: Array<OsobaTmdbI>, ukupnoStranica: number }> {
    //     const resurs = "/person/popular";
    //     const parametri = { page: stranica };
    //     const odgovor = await this.obaviZahtjev(resurs, parametri);
    //     const json = JSON.parse(odgovor);
    //     const ukupnoStranica = json.total_pages;
    //     const osobe = json.results as Array<OsobaTmdbI>;
    //     return { osobe, ukupnoStranica };
    // }
    async pretraziOsobePoImenu(trazi, stranica) {
        let resurs = "/search/person";
        let parametri = {
            sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,
            query: trazi,
        };
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        let json = JSON.parse(odgovor);
        let ukupnoStranica = json.total_pages;
        let osobe = json.results.map((osoba) => ({
            id: osoba.id,
            ime_prezime: osoba.name,
            poznat_po: osoba.known_for_department,
            slika: osoba.profile_path,
            popularnost: osoba.popularity || null,
        }));
        return { osobe, ukupnoStranica };
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
    async obaviZahtjevDohvatiFilm(resurs, parametri = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
    async dohvatiFilmoveOsobe(id) {
        const resurs = `/person/${id}/movie_credits`;
        const odgovor = await this.obaviZahtjevDohvatiFilm(resurs);
        // Dohvaćeni filmovi
        const filmovi = JSON.parse(odgovor).cast;
        // Vratite samo prvih 20 filmova
        return filmovi.slice(0, 20).map((film) => ({
            id: film.id,
            naslov: film.title,
            originalni_naslov: film.original_title,
            popularnost: film.popularity,
            slikica_postera: film.poster_path,
            datum_izdavanja: film.release_date,
            opis: film.overview,
            jezik: film.original_language,
            lik: film.character
        }));
    }
}
