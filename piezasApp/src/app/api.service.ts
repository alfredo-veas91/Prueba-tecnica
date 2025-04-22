import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable ,Subject } from 'rxjs'; 
import { tap } from 'rxjs/operators';

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
  
}