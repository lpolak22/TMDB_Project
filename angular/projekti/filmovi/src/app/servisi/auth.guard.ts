import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { StatusService } from "./status.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private statusService: StatusService) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const korisnik = await this.korisnikSesija();

    if (state.url === "" || state.url === "/") {
      if (korisnik) {
        return true;
      }
      this.router.navigate(["/prijava"]);
      return false;
    }

    if (state.url === "/dokumentacija") {
      return true;
    }

    if (["/prijava", "/registracija"].includes(state.url)) {
      if (!korisnik) {
        return true;
      }
      this.router.navigate(["/"]);
      return false;
    }

    const tipKorisnika = korisnik?.tip_korisnika_id;
    const status = await this.statusService.dobaviStatus(korisnik.korime);
    let uvjet1 = [
      "/osobe",
      "/korisnici",
      "/dodavanje",
      "/filtriranje-filmova",
      "/dvorazinska",
      `/detalji/${route.params["id"]}`,
    ];
    let uvjet2 = [
      "/",
      "/osobe",
      "/filtriranje-filmova",
      "/dvorazinska",
      `/detalji/${route.params["id"]}`,
    ];
    if (tipKorisnika === 1 && uvjet1.includes(state.url)) {
      return true;
    } else if (
      tipKorisnika === 2 &&
      status == "1" &&
      uvjet2.includes(state.url)
    ) {
      return true;
    } else if (
      tipKorisnika === 2 &&
      (status == "0" || status == "2") &&
      ["/", "/dvorazinska"].includes(state.url)
    ) {
      return true;
    }

    this.router.navigate(["/"]);
    return false;
  }

  private async korisnikSesija(): Promise<any> {
    return new Promise((resolve) => {
      const korisnik = sessionStorage.getItem("korisnik");
      resolve(korisnik ? JSON.parse(korisnik) : null);
    });
  }
}
