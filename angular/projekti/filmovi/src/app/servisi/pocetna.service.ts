import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PocetnaService {
  restServis: string = environment.restServis;
  osobe: any[] = [];
  currentPage: number = 1;
  
  constructor() {}
    
}
