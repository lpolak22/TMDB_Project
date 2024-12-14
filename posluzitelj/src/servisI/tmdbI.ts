export interface OsobaTmdbI {
    id:number;
    ime_prezime:string;
    poznat_po:string;
    slika:string;
    popularnost:number|null;
  }
  
export interface FilmoviTmdbI {
    page:number;
    results:Array<FilmTmdbI>;
    total_pages:number;
    total_results:number;
  }
  
  export interface FilmTmdbI {
    id:number;
    jezik:string;
    originalni_naslov:string;
    naslov:string;
    popularnost:number;
    slikica_postera:string;
    datum_izdavanja:string;
    opis:string;
  }
