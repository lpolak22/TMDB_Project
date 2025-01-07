import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AktiviranjeDvorazinskeService {
  restServis: string = environment.restServis;

  constructor() {}

  async azurirajTOTP(korime: string, totpSifra: string | null) {
    try {
      let AktivnaDvoAut = 1;
      const response = await fetch(
        `${this.restServis}app/dvorazinska/${korime}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ korime, AktivnaDvoAut, totpSifra }),
        }
      );

      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(pogreskaInfo.greska || "Nije uspjelo stavljanje totp");
      }
      return response.json();
    } catch (error) {
      console.error("Greška prilikom davanja pristupa:", error);
      throw error;
    }
  }

  async deaktivirajTOTP(korime: string) {
    try {
      let AktivnaDvoAut = 0;
      const response = await fetch(
        `${this.restServis}app/dvorazinska/${korime}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ korime, AktivnaDvoAut, deaktivacija: true }),
        }
      );

      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(
          pogreskaInfo.greska || "Nije uspjelo isključivanje totp"
        );
      }
    } catch (error) {
      console.error("Greška prilikom isključivanja totp:", error);
      throw error;
    }
  }

  async dohvatiTOTP(korime: string) {
    try {
      let response = await fetch(
        `${this.restServis}app/dvorazinska?korime=${korime}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        let data = await response.json();
        return data;
      } else {
        throw new Error("Neuspješno dohvacanje korisnika");
      }
    } catch (error) {
      console.error("Greška prilikom provjere TOTP-a:", error);
      throw new Error("Neuspješno dohvacanje TOTP-a");
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
}
