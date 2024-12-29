import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { OsobeComponent } from './osobe/osobe.component';
import { DetaljiComponent } from './detalji/detalji.component';
import { DodavanjeComponent } from './dodavanje/dodavanje.component';
import { FormsModule } from '@angular/forms';
import { FiltriranjeFilmovaComponent } from './filtriranje-filmova/filtriranje-filmova.component';
import { AuthGuard } from './servisi/auth.guard';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaModule } from 'ng-recaptcha';

import { environment } from '../environments/environment';

const routes: Routes = [
  { path: '', component: PocetnaComponent, canActivate: [AuthGuard] },
  { path: 'osobe', component: OsobeComponent, canActivate: [AuthGuard] },
  { path: 'detalji/:id', component: DetaljiComponent, canActivate: [AuthGuard] },
  { path: 'dodavanje', component: DodavanjeComponent, canActivate: [AuthGuard] },
  { path: 'korisnici', component: KorisniciComponent, canActivate: [AuthGuard] },
  { path: 'filtriranje-filmova', component: FiltriranjeFilmovaComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: '**', redirectTo: '' }
];


@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    DokumentacijaComponent,
    DodavanjeComponent,
    FiltriranjeFilmovaComponent,
    KorisniciComponent
  ],
  imports: [
    BrowserModule,
    OsobeComponent,
    RouterModule.forRoot(routes),
    FormsModule,
    RecaptchaV3Module,
    RecaptchaModule
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.siteKey }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
