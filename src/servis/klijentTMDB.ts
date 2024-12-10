import { FilmoviTmdbI, OsobaTmdbI } from "../servisI/tmdbI.js";

export class TMDBklijent {
    private bazicniURL = "https://api.themoviedb.org/3";
    private apiKljuc:string;
    constructor(apiKljuc:string){
       this.apiKljuc = apiKljuc;
    }

    public async dohvatiOsobe(stranica: number = 1) {
      const resurs = "/person/popular";
      const parametri = { page: stranica };
      const odgovor = await this.obaviZahtjev(resurs, parametri);
      const json = JSON.parse(odgovor);
  
      return json.results as Array<OsobaTmdbI>;
  }
  
  

    public async dohvatiOsobu(id:number){
       let resurs = "/person/"+id;
       let odgovor = await this.obaviZahtjev(resurs);
       return JSON.parse(odgovor) as OsobaTmdbI;
    }

    public async pretraziFilmovePoNazivu(trazi:string,stranica:number){
       let resurs = "/search/movie";
       let parametri = {sort_by: "popularity.desc",
                        include_adult: false,
                        page: stranica,
                        query: trazi};

       let odgovor = await this.obaviZahtjev(resurs,parametri);
       return JSON.parse(odgovor) as FilmoviTmdbI;
    }

    public async pretraziOsobePoImenu(trazi:string,stranica:number){
        let resurs = "/search-person";
        let parametri = {sort_by: "popularity.desc",
                         include_adult: false,
                         page: stranica,
                         query: trazi};
 
        let odgovor = await this.obaviZahtjev(resurs,parametri);
        return JSON.parse(odgovor) as FilmoviTmdbI;
     }

    private async obaviZahtjev(resurs:string,parametri:{[kljuc:string]:string|number|boolean}={}){
        let zahtjev = this.bazicniURL+resurs+"?api_key="+this.apiKljuc;
        for(let p in parametri){
            zahtjev+="&"+p+"="+parametri[p];
        }
        let odgovor = await fetch(zahtjev);
        let rezultat = await odgovor.text();
        return rezultat;
    }
}