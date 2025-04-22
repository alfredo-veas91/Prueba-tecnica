import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-update-categoria',
  templateUrl: './update-categoria.page.html',
  styleUrls: ['./update-categoria.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class UpdateCategoriaPage implements OnInit {
  categoryId!: number;
  categoryName: string = '';
  isLoading: boolean = true;
  currentCategoryName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.categoryId = +this.route.snapshot.params['id'];
    this.loadCategory();
  }

  loadCategory() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        const categoria = response.data.find((cat: any) => cat.id === this.categoryId); //busca el nombre de la categoria selecionada
        this.currentCategoryName = categoria.nombre; //para mostrarlo como place holder en la pagina
        this.categoryName = this.currentCategoryName; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading category', err);
        this.isLoading = false;
      }
    });
  }

  updateCategory() {
    if (!this.categoryName.trim()) return; 
      
    this.apiService.updateCategory({id: this.categoryId, nombre: this.categoryName}).subscribe({
      next: () => {
        this.router.navigate(['/categorias']);
      },
      error: (err) => {
        console.error('Error updating category', err);
      }
    });
  }
}