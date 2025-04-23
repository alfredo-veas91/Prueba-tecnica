import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable ,Subject } from 'rxjs'; 
import { tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private categoriaActualizada = new Subject<void>();
  categoriaActualizada$ = this.categoriaActualizada.asObservable();


  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      fecha_nacimiento: userData.birthdate,
      telefono_codigo: userData.countryCode,
      telefono_numero: userData.phone
    });
  }
  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('auth_token', response.token); // Guarda el token
        }
      })
    );
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        // Limpiar el token después de logout exitoso
        localStorage.removeItem('auth_token');
      })
    );
  }
  // CRUDS para categorías
  getCategories(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.apiUrl}/categorias`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  createCategory(data: { nombre: string }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.apiUrl}/categorias`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        this.categoriaActualizada.next();
      })
    );
  }
  

  updateCategory(data: { id: number, nombre: string }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.put(`${this.apiUrl}/categorias/${data.id}`, 
      data,  
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    ).pipe(
      tap(() => {
        this.categoriaActualizada.next();  
      })
    );
  }

  deleteCategory(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.delete(`${this.apiUrl}/categorias/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  //CRUD Productos/Piezas

  getPiezas(page: number = 1, perPage: number = 10, filtros: any = {}): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const params = new URLSearchParams();

    // Parámetros de paginación
    params.append('page', String(page));
    params.append('per_page', String(perPage));

    // Filtros opcionales
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.categoria_id) params.append('categoria_id', filtros.categoria_id);
    if (filtros.precio) params.append('precio', filtros.precio);
    if (filtros.precio_min) params.append('precio_min', filtros.precio_min);
    if (filtros.precio_max) params.append('precio_max', filtros.precio_max);

    return this.http.get(`${this.apiUrl}/piezas?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  //Crear pieza y subir imagen asociada

  createPieza(piezaData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.post(`${this.apiUrl}/piezas`, piezaData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  uploadImagenPieza(piezaId: number, imagen: File): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    formData.append('pieza_id', piezaId.toString());
    formData.append('imagen', imagen);

    return this.http.post(`${this.apiUrl}/pieza/imagen`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
        // No Content-Type para FormData, se setea automáticamente
      }
    });
  }

  //Obtener la Url de la imagen 
  getImageUrl(path: string): string {
    const baseUrl = this.apiUrl.replace('/api', '');
    // Asegura que la ruta no comience con /
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${baseUrl}/storage/${cleanPath}`;
  }
  //Obtener los datos de una pieza en especifico
  getPiezaById(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.apiUrl}/piezas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap({
        next: (response) => console.debug('API Response:', response),
        error: (err) => console.error('API Error:', err)
      })
    );
  }

  getPiezaWithImages(id: number): Observable<any> {
    return forkJoin([
      this.getPiezaById(id),
      this.getPiezaImages(id)
    ]).pipe(
      map(([piezaData, imagesData]) => {
        return {
          ...piezaData.data,
          imagenes: imagesData.data || []
        };
      })
    );
  }
  
  getPiezaImages(piezaId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.get(`${this.apiUrl}/piezas/${piezaId}/imagenes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Actualizar pieza
  updatePieza(data: {
    id: number;
    nombre: string;
    precio: number;
    categoria_id: number;
    descripcion?: string;
  }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.put(`${this.apiUrl}/piezas/${data.id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
  //Borrar pieza
  deletePieza(id: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    return this.http.delete(`${this.apiUrl}/piezas/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      tap(() => {
        this.categoriaActualizada.next(); 
      })
    );
  }
}