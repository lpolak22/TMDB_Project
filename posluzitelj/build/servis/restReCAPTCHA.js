import { ReCaptchaDAO } from "./reCaptchaDAO.js";
export class RestReCAPTCHA {
    rDao;
    constructor(api_kljuc) {
        this.rDao = new ReCaptchaDAO(api_kljuc);
    }
    async getReCAPTCHA(zahtjev, odgovor) {
        try {
            const { token } = zahtjev.body;
            if (!token) {
                odgovor.status(400).json({ error: "Nedostaje reCAPTCHA token." });
                return;
            }
            const rezultat = await this.rDao.provjeriRecaptcha(token);
            odgovor.status(200).json(rezultat);
            return;
        }
        catch (error) {
            console.error("Greška pri provjeri reCAPTCHA:", error);
            odgovor.status(400).json({ error: "Greška pri validaciji reCAPTCHA." });
            return;
        }
    }
}
