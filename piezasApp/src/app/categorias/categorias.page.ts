import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';
import { ApiService } from '../api.service';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.page.html',
  styleUrls: ['./categorias.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButton, IonIcon, CommonModule, FormsModule,
    RouterModule, SideMenuComponent
  ]
})
export class CategoriasPage {
  @ViewChild(SideMenuComponent) sideMenu!: SideMenuComponent;
  categories: any[] = [];
  newCategoryName: string = '';
  showCreateModal: boolean = false; // Añade esta propiedad

  constructor(private apiService: ApiService) {
    addIcons({ add });
  }

  ngOnInit() {
    this.loadCategories();
  }

  toggleMenu() {
    this.sideMenu.toggleMenu();
  }

  // Añade este método
  openCreateModal() {
    this.showCreateModal = true;
    this.newCategoryName = '';
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.data,
        console.log('Datos recibidos:', data);
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }
  
  createCategory() {
    if (!this.newCategoryName.trim()) return;
    
    this.apiService.createCategory(this.newCategoryName).subscribe({
      next: () => {
        this.loadCategories();
        this.showCreateModal = false; // Cierra el modal después de crear
      },
      error: (err) => console.error('Error creating category', err)
    });
  }
}