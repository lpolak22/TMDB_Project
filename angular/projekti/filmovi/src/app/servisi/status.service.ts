import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StatusService {
  restServis: string = environment.restServis;
  status: string = "";

  constructor() {}

  async dobaviStatus(korime: string) {
    try {
      let response = await fetch(`${this.restServis}app/status/${korime}`);
      if (response.status === 200) {
        let data = await response.json();

        this.status = data.status[0].status;
        return this.status;
      } else {
        throw new Error("Neuspjesno dohvacanje");
      }
    } catch (error) {
      console.error(error);
      throw new Error("Neuspjesno dohvacanje");
    }
  }
}
