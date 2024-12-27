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

const routes:Routes = [
  {path: '', component: PocetnaComponent},
  {path: 'dokumentacija', component: DokumentacijaComponent},
  {path: 'osobe', component: OsobeComponent},
  { path: 'detalji/:id', component: DetaljiComponent },
  {path: 'dodavanje', component: DodavanjeComponent},
  {path: 'filtriranje-filmova', component: FiltriranjeFilmovaComponent},

  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    DokumentacijaComponent,
    DodavanjeComponent,
    FiltriranjeFilmovaComponent
  ],
  imports: [
    BrowserModule,
    OsobeComponent,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
