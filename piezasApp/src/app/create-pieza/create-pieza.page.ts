import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-pieza',
  templateUrl: './create-pieza.page.html',
  styleUrls: ['./create-pieza.page.scss'],
  standalone: true,
  imports: [CommonModule,NgIf, FormsModule]
})
export class CreatePiezaPage implements OnInit {
  pieza = {
    nombre: '',
    descripcion: '',
    precio: null,
    categoria_id: null
  };
  
  categorias: any[] = [];
  imagenSeleccionada: File | null = null;
  imagenPrevia: string | ArrayBuffer | null = null;
  isSaving: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  goBack() {
    this.router.navigate(['/piezas']);
  }

  cargarCategorias() {
    this.apiService.getCategories().subscribe({
      next: (response) => {
        this.categorias = response.data;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      
      // Crear previsualización
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPrevia = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  soloNumeros(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }

  async submitForm() {
    if (this.isSaving) return;
    
    this.isSaving = true;
    
    try {
      // 1. Primero creamos la pieza sin imagen
      const response: any = await this.apiService.createPieza(this.pieza).toPromise();
      console.log('Respuesta creación de pieza:', response);
  
      // Extraemos el ID de la pieza creada
      const piezaId = response?.id || response?.data?.id;
      if (!piezaId) {
        throw new Error('No se recibió el ID de la pieza creada');
      }
  
      // 2. Si hay imagen, la subimos por separado
      if (this.imagenSeleccionada) {
        try {
          console.log('Subiendo imagen para pieza ID:', piezaId);
          const uploadResponse = await this.apiService.uploadImagenPieza(piezaId, this.imagenSeleccionada).toPromise();
          console.log('Imagen subida:', uploadResponse);
        } catch (uploadError) {
          console.error('Error al subir imagen:', uploadError);
          // Opción 1: Continuar sin imagen
          // Opción 2: Mostrar error y permitir reintentar
          alert('La pieza se creó pero hubo un error subiendo la imagen');
        }
      }
      
      
      // 3. Redirigir con mensaje de éxito
      this.router.navigate(['/piezas'], {
        queryParams: { refresh: new Date().getTime() } // Forzar recarga
      });
      
    } catch (error) {
      console.error('Error al crear pieza:', error);
      alert('Error: ' + (error || 'No se pudo guardar el producto'));
    } finally {
      this.isSaving = false;
    }
  }
}