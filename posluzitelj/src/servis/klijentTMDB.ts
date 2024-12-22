import { OsobaTmdbI } from "../servisI/tmdbI.js";

export class TMDBklijent {
    private bazicniURL = "https://api.themoviedb.org/3";
    private apiKljuc: string;

    constructor(apiKljuc: string) {
        this.apiKljuc = apiKljuc;
    }

    // Funkcija za dohvat osoba s podrškom za stranicenje
    public async dohvatiOsobe(stranica: number): Promise<{ osobe: Array<OsobaTmdbI>, ukupnoStranica: number }> {
        const resurs = "/person/popular";
        const parametri = { page: stranica }; // Stranica je sada dinamička
        const odgovor = await this.obaviZahtjev(resurs, parametri);
        const json = JSON.parse(odgovor);

        const ukupnoStranica = json.total_pages; // Ukupni broj stranica
        const osobe = json.results as Array<OsobaTmdbI>;

        return { osobe, ukupnoStranica };
    }

    // Funkcija za pretragu osoba po imenu s stranicenjem
    public async pretraziOsobePoImenu(trazi: string, stranica: number): Promise<{ osobe: Array<OsobaTmdbI>, ukupnoStranica: number }> {
        let resurs = "/search/person";
        let parametri = {
            sort_by: "popularity.desc",
            include_adult: false,
            page: stranica,  // Dinamička stranica
            query: trazi,
        };

        let odgovor = await this.obaviZahtjev(resurs, parametri);
        let json = JSON.parse(odgovor);

        const ukupnoStranica = json.total_pages;
        const osobe = json.results.map((osoba: any) => ({
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
}
