import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { arrowBack } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-create-categoria',
  templateUrl: './create-categoria.page.html',
  styleUrls: ['./create-categoria.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon, IonInput, CommonModule, FormsModule, RouterModule
  ]
})
export class CreateCategoriaPage {
  categoryName: string = '';

  constructor(private router: Router, private apiService: ApiService) {
    addIcons({ arrowBack });
  }

  volver() {
    this.router.navigate(['/categorias']);
  }

  guardarCategoria() {
    if (!this.categoryName.trim()) return;
    
    this.apiService.createCategory({ nombre: this.categoryName }).subscribe({
      next: () => {
        this.volver();
      },
      error: (err) => console.error('Error al crear categoría', err)
    });
  }
}
