import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-edit-pieza',
  templateUrl: './edit-pieza.page.html',
  styleUrls: ['./edit-pieza.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditPiezaPage {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  product: any = {
    id: null,
    nombre: '',
    precio: null,
    categoria_id: null,
    descripcion: ''
  };
  categorias: any[] = [];
  isSaving = false;

  ionViewWillEnter() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const navigation = this.router.getCurrentNavigation();
    const stateProduct = navigation?.extras?.state?.['productData'];

    if (stateProduct) {
      this.product = { ...stateProduct };
    } else {
      this.loadProduct(id);
    }

    this.loadCategories();
  }

  loadProduct(id: number) {
    this.apiService.getPiezaById(id).subscribe({
      next: (response) => {
        this.product = response.data || response;
      },
      error: () => {
        this.router.navigate(['/piezas']);
      }
    });
  }

  loadCategories() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categorias = response.data || response;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  async submitForm() {
    if (!this.product.nombre || !this.product.precio || !this.product.categoria_id) return;

    this.isSaving = true;

    try {
      const response = await this.apiService.updatePieza({
        id: this.product.id,
        nombre: this.product.nombre,
        precio: this.product.precio,
        categoria_id: this.product.categoria_id,
        descripcion: this.product.descripcion || ''
      }).toPromise();

      const toast = await this.toastCtrl.create({
        message: 'Producto actualizado correctamente',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/details-pieza', this.product.id]);
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al actualizar el producto',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.isSaving = false;
    }
  }

  goBack() {
    this.router.navigate(['/details-pieza', this.product.id]);
  }
}