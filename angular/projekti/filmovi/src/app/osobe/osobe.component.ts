import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf and *ngFor
import { OsobeService } from '../servisi/osobe.service';  // Import the OsobeService
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-osobe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './osobe.component.html',
  styleUrls: ['./osobe.component.scss']
})
export class OsobeComponent implements OnInit {
  isLoading: boolean = true;
  errorMessage: string = '';
  osobe: any[] = [];
  currentPage: number = 1;

  constructor(private osobeService: OsobeService) {}

  ngOnInit() {
    this.loadOsobe(this.currentPage);
  }

  async loadOsobe(stranica: number) {
    let parametri = `?stranica=${stranica}`;
    try {
      let response = await fetch(`${environment.restServis}osoba${parametri}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log(response);
      
  
      if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        
        this.osobe = data;
        return this.osobe;
      } else {
        throw new Error('Failed to load people data');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to load people data');
    }
  }
  

  goToPersonDetails(id: number) {
    // Navigate to the details page (modify as per your routing)
    window.location.href = `/detalji/${id}`;
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadOsobe(this.currentPage);
  }
}
