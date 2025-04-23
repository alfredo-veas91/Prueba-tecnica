import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { catchError, finalize, switchMap, tap,  } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone'; 


@Component({
  selector: 'app-details-pieza',
  templateUrl: './details-pieza.page.html',
  styleUrls: ['./details-pieza.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DetailsPiezaPage {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  errorMessage: string | null = null;
  debugInfo = '';
  product: any;
  isLoading = false; 
  // Variables para controlar el modal de eliminacion
  showDeleteModal = false;
  isDeleting = false;

  ionViewWillEnter() {
    const navigation = this.router.getCurrentNavigation();
    const stateProduct = navigation?.extras?.state?.['productData'];
    
    if (stateProduct) {
      this.product = stateProduct;
      
      // Si no hay imágenes en los datos del estado, intenta cargarlas
      if (!this.product.imagenes) {
        this.getImageDebugUrl();
      }
    } else {
      this.loadProduct();
    }
  }
  getImageDebugUrl(): string {
    if (!this.product?.imagenes?.[0]?.url) return 'No hay URL de imagen';
    const url = this.apiService.getImageUrl(this.product.imagenes[0].url);
    return `URL construida: ${url}`;
  }

  getFullImageUrl(): string {
    if (!this.product?.imagenes?.[0]?.url) return 'No hay imagen';
    const url = this.apiService.getImageUrl(this.product.imagenes[0].url);
    console.log('URL construida:', url);
    return url;
  }

  loadProduct() {
    this.isLoading = true;
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.apiService.getPiezaById(id).pipe(
          catchError(() => {
            this.router.navigate(['/piezas']);
            return of(null);
          })
        );
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => {
        if (response) {
          this.product = response.data || response;
        }
      }
    });
  }

  getImageUrl(path: string): string {
    return this.apiService.getImageUrl(path);
  }

  async editProduct() {
    if (!this.product?.id) return;
  
    this.router.navigate(['/edit-pieza', this.product.id], {
      state: { 
        productData: this.product 
      }
    });
  }

  // Método para abrir el modal
  deleteProduct() {
    this.showDeleteModal = true;
  }

  // Método para cancelar
  cancelDelete() {
    this.showDeleteModal = false;
  }

  // Método para confirmar eliminación
  async confirmDelete() {
    if (!this.product?.id) return;
    
    this.isDeleting = true;
    
    try {
      await this.apiService.deletePieza(this.product.id).toPromise();
      
      // Mostrar notificación
      const toast = await this.toastCtrl.create({
        message: 'Producto eliminado correctamente',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
      
      // Navegar de vuelta a la lista
      this.router.navigate(['/piezas']);
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al eliminar el producto',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.isDeleting = false;
      this.showDeleteModal = false;
    }
  }
}