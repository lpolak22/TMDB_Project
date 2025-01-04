import { ReCaptchaDAO } from "./reCaptchaDAO.js";
import { Request, Response } from "express";

export class RestReCAPTCHA {
  private rDao: ReCaptchaDAO;

  constructor(api_kljuc: string) {
    this.rDao = new ReCaptchaDAO(api_kljuc);
  }

  async getReCAPTCHA(zahtjev: Request, odgovor: Response): Promise<void> {
    try {
      const { token } = zahtjev.body;
      
      if (!token) {
        odgovor.status(400).json({ error: "Nedostaje reCAPTCHA token." });
        return;
      }

      const rezultat = await this.rDao.provjeriRecaptcha(token);
      odgovor.status(200).json(rezultat);
      return;
    } catch (error) {
      console.error("Greška pri provjeri reCAPTCHA:", error);
      odgovor.status(400).json({ error: "Greška pri validaciji reCAPTCHA." });
      return;
    }
  }
}
