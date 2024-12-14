import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { OsobeComponent } from './osobe/osobe.component';
//import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';

const routes:Routes = [
  {path: '', component: PocetnaComponent},
  {path: 'dokumentacija', component: DokumentacijaComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    OsobeComponent,
    //DokumentacijaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
