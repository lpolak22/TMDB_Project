export interface KorisnikI {
  ime: string | null;
  prezime: string | null;
  korime: string;
  lozinka: string;
  email: string;
  tip_korisnika_id: number;
  adresa: string | null;
  status: number | null;
  broj_telefona: string | null;
  datum_rodenja: string | null;
}
