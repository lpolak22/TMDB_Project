// import fetch from "node-fetch";
export class ReCaptchaDAO {
    bazicniURL = "https://www.google.com/recaptcha/api/siteverify";
    apiKljuc;
    constructor(apiKljuc) {
        this.apiKljuc = apiKljuc;
    }
    async provjeriRecaptcha(token) {
        try {
            const odgovor = await fetch(this.bazicniURL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    secret: this.apiKljuc,
                    response: token,
                }),
            });
            const podaci = await odgovor.json();
            return {
                success: podaci.success,
                score: podaci.score || 0,
            };
        }
        catch (error) {
            console.error("Greška prilikom validacije reCAPTCHA:", error);
            throw new Error("Neuspješna validacija reCAPTCHA.");
        }
    }
}
