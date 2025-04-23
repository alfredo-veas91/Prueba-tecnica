import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonicModule, IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';



@Component({
  selector: 'app-piezas',
  templateUrl: './piezas.page.html',
  styleUrls: ['./piezas.page.scss'],
  standalone: true,
  imports: [CommonModule,
    IonicModule,SideMenuComponent]
})
export class PiezasPage implements OnInit {
  @ViewChild(IonContent) ionContent!: IonContent;
  @ViewChild(SideMenuComponent) sideMenu!: SideMenuComponent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  @HostListener('window:scroll', [])


  private refreshSubscription!: Subscription;

  piezas: any[] = [];
  currentPage = 1;
  perPage = 10;
  isLoading = false;
  isLastPage = false;


  constructor(private apiService: ApiService, private router: Router) {}


  private forceReload() {
    this.piezas = []; // Limpiar la lista actual
    this.currentPage = 1; // Resetear paginación
    this.isLastPage = false;
    this.loadMore(); // Volver a cargar los datos
  }


  ngOnInit(): void {
    this.loadMore();
    this.refreshSubscription = this.apiService.categoriaActualizada$.subscribe({
      next: () => {
        this.forceReload();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  onWindowScroll() {
    this.onScroll();
  }
  onScroll(): void {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        this.loadMore();
      }
  }
  toggleMenu() {
    this.sideMenu.toggleMenu();
  }

  navigateToCreatePieza() {
    this.router.navigate(['/create-pieza']); // Asegúrate que coincide con tu ruta
  }

  getImageUrl(path: string): string {
    return this.apiService.getImageUrl(path);
  }


  loadMore(event?: any): void {
    if (this.isLoading || this.isLastPage) {
      if (event && event.target) {
        event.target.complete();
      }
      return;
    }
  
    this.isLoading = true;
    this.apiService.getPiezas(this.currentPage, this.perPage).subscribe({
      next: (response) => {
        this.piezas.push(...response.data);
        this.isLastPage = response.current_page >= response.last_page;
        this.currentPage++;
        this.isLoading = false;
        if (event && event.target) {
          event.target.complete();
        }
      },
      error: () => {
        this.isLoading = false;
        if (event && event.target) {
          event.target.complete();
        }
      }
    });
  }
   
  goToProductDetail(productId: number) {
    this.router.navigate(['/product-detail', productId]);
  }
  
  // Método para navegar al detalle
  viewProductDetail(id: number) {
    const product = this.piezas.find(p => p.id === id);
    
    if (product && product.imagenes) {
      // Si ya tenemos las imágenes en el listado, las pasamos directamente
      this.router.navigate(['/details-pieza', id], {
        state: { 
          productData: product
        }
      });
    } else {
      // Si no, hacemos una llamada especial para obtener las imágenes
      this.apiService.getPiezaWithImages(id).subscribe({
        next: (productWithImages) => {
          this.router.navigate(['/details-pieza', id], {
            state: { 
              productData: productWithImages
            }
          });
        },
        error: () => {
          // Si falla, navegamos sin imágenes
          this.router.navigate(['/details-pieza', id], {
            state: { 
              productData: product || { id }
            }
          });
        }
      });
    }
  }
} 
