import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service'; // Asegúrate que la ruta sea correcta
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  templateUrl: './login.page.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService, // Inyecta el ApiService
    private router: Router // Para redirección después de login
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      const response = await this.api.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).toPromise();

      console.log('Login exitoso', response);
      this.router.navigate(['/home-page']); // Redirige al home después de login

    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Manejo de errores específicos
      if (error.status === 401) {
        this.errorMessage = 'Email o contraseña incorrectos';
      } else if (error.status === 0) {
        this.errorMessage = 'No se pudo conectar al servidor';
      } else {
        this.errorMessage = error.error?.message || 'Error desconocido';
      }

    } finally {
      this.loading = false;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Método para mostrar errores de validación
  hasError(controlName: string, errorType?: string): boolean {
    const control = this.loginForm.get(controlName);
    
    if (!control) return false;
    
    if (errorType) {
      return control.hasError(errorType) && (control.touched || this.submitted);
    }
    
    return control.invalid && (control.touched || this.submitted);
  }
}