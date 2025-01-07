import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PrijavaService {
  restServis: string = environment.restServis;

  constructor() {}

  async prijaviKorisnika(korime: string, lozinka: string): Promise<any> {
    try {
      const response = await fetch(`${this.restServis}app/prijava`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ korime, lozinka }),
      });

      if (response.ok) {
        const korisnik = await response.json();
        if (korisnik.test == 1.0) {
          return korisnik;
        } else {
          return korisnik;
        }
      } else {
        const error = await response.json();
        throw new Error(error.greska || "Neuspješna prijava");
      }
    } catch (error) {
      console.error("Greška tijekom prijave:", error);
      throw error;
    }
  }

  async provjeriDvaFA(korime: string) {
    try {
      let response = await fetch(
        `${this.restServis}app/aktivnaDvaFA/${korime}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        let data = await response.json();

        return data.dvaFA[0]?.AktivnaDvoAut;
      } else {
        throw new Error("Neuspješno dohvacanje 2FA");
      }
    } catch (error) {
      throw new Error("Neuspješno dohvacanje 2FA-a");
    }
  }

  async provjeriTOTP(korime: string, totpKod: string) {
    try {
      let response = await fetch(
        `${this.restServis}app/dvorazinska?korime=${korime}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totpKod }),
        }
      );

      if (response.status === 201) {
        let data = await response.json();
        return data.tajniKljuc[0].totp;
      } else {
        throw new Error("Neuspješno dohvacanje korisnika");
      }
    } catch (error) {
      console.error("Greška prilikom provjere TOTP-a:", error);
      throw new Error("Neuspješno dohvacanje TOTP-a");
    }
  }

  async provjeriRecaptcha(token: string): Promise<number> {
    try {
      const response = await fetch(`${this.restServis}app/recaptcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Neuspješna validacija reCAPTCHA.");
      }

      const { success, score } = await response.json();

      if (!success) {
        throw new Error("reCAPTCHA nije uspješan.");
      }

      return score;
    } catch (error) {
      console.error("Greška pri provjeri reCAPTCHA:", error);
      throw error;
    }
  }
}
