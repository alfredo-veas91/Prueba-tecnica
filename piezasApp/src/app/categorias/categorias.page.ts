import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
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
export class CategoriasPage implements OnInit {
  @ViewChild(SideMenuComponent) sideMenu!: SideMenuComponent;
  categories: any[] = [];
  filteredCategories: any[] = [];
  newCategoryName: string = '';
  showDeleteModal: boolean = false;
  categoryToDelete: any = null;
  searchTerm: string = '';

  constructor(private apiService: ApiService, private router: Router) {
    addIcons({ add });
  }

  ngOnInit() {
    this.loadCategories();
    
    this.apiService.categoriaActualizada$.subscribe(() => {
      this.loadCategories(); 
    });
  }

  toggleMenu() {
    this.sideMenu.toggleMenu();
  }


  openDeleteModal(category: any) {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.data;
        this.filteredCategories = [...this.categories]; // Inicializa con todas las categorías
        console.log('Datos recibidos:', data);
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  filterCategories() {
    if (!this.searchTerm) {
      this.filteredCategories = [...this.categories];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCategories = this.categories.filter(category => 
        category.nombre.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
    this.filterCategories();
  }

  createCategory() {
    this.router.navigate(['/create-categoria']);
  }
  navigateToUpdate(categoryId: number) {
    this.router.navigate(['/update-categoria', categoryId]);
  }

  confirmDelete() {
    if (!this.categoryToDelete) return;
    
    this.apiService.deleteCategory(this.categoryToDelete.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.categoryToDelete = null;
        this.loadCategories();
      },
      error: (err) => {
        console.error('Error al eliminar categoría', err);
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }
}