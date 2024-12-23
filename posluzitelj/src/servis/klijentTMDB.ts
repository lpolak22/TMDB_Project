import { OsobaTmdbI } from "../servisI/tmdbI.js";

export class TMDBklijent {
    private bazicniURL = "https://api.themoviedb.org/3";
    private apiKljuc: string;

    constructor(apiKljuc: string) {
        this.apiKljuc = apiKljuc;
    }

    public async dohvatiOsobe(stranica: number): Promise<{ osobe: Array<OsobaTmdbI>, ukupnoStranica: number }> {
        const resurs = "/person/popular";
        const parametri = { page: stranica };
        const odgovor = await this.obaviZahtjev(resurs, parametri);
        const json = JSON.parse(odgovor);

        const ukupnoStranica = json.total_pages;
        const osobe = json.results as Array<OsobaTmdbI>;

        return { osobe, ukupnoStranica };
    }

    public async pretraziOsobePoImenu(trazi: string, stranica: number): Promise<{ osobe: Array<OsobaTmdbI>, ukupnoStranica: number }> {
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
        let osobe = json.results.map((osoba: any) => ({
            id: osoba.id,
            ime_prezime: osoba.name,
            poznat_po: osoba.known_for_department,
            slika: osoba.profile_path,
            popularnost: osoba.popularity || null,
        })) as Array<OsobaTmdbI>;

        return { osobe, ukupnoStranica };
    }

    private async obaviZahtjev(resurs: string, parametri: { [kljuc: string]: string | number | boolean } = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        for (let p in parametri) {
            zahtjev += "&" + p + "=" + parametri[p];
        }
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }

    private async obaviZahtjevDohvatiFilm(resurs: string, parametri: { [kljuc: string]: string | number | boolean } = {}) {
        let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }

    public async dohvatiFilmoveOsobe(id: number): Promise<any> {
        const resurs = `/person/${id}/movie_credits`;
        const odgovor = await this.obaviZahtjevDohvatiFilm(resurs);
        return JSON.parse(odgovor).cast.map((film: any) => ({
          id: film.id,
          naslov: film.title,
          originalni_naslov: film.original_title,
          popularnost: film.popularity,
          slikica_postera: film.poster_path,
          datum_izdavanja: film.release_date,
          opis: film.overview,
          jezik: film.original_language,
        }));
      }
      
     
    
}
