import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class RegistracijaService {
  restServis: string = environment.restServis;

  constructor() {}

  async dodajOsobuUBazu(podaciOsobe: any): Promise<void> {
    try {
      const response = await fetch(`${this.restServis}app/registracija`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(podaciOsobe),
      });

      if (!response.ok) {
        const pogreskaInfo = await response.json();
        throw new Error(
          pogreskaInfo.greska || "Neuspješno dodavanje korisnika."
        );
      }
    } catch (error) {
      console.error(error);
      throw error;
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
