import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.page.html',
})
export class RegistroPage {
  registerForm: FormGroup;
  submitted: boolean= false;
  loading = false;

  countryCodes = [
    { code: '+56', flag: '🇨🇱' },
    { code: '+54', flag: '🇦🇷' },
    { code: '+57', flag: '🇨🇴' },
    { code: '+1', flag: '🇺🇸' },
    { code: '+34', flag: '🇪🇸' },
    // Se pueden añadir mas paises
  ];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', Validators.required],
      countryCode: ['+56', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }


  sanitizePhone(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.registerForm.get('phone')?.setValue(input.value);
  }  
  

  async onSubmit() {
    this.submitted = true;    
    this.loading = true;
    
    try {
      const response = await this.api.register(this.registerForm.value).toPromise();
      console.log('Registro exitoso', response);
      
      // Redirigir al login después de registro exitoso
      this.router.navigate(['/login'], {
        state: { registrationSuccess: true }
      });
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Manejo de errores (puedes personalizar según los errores de tu API)
      let errorMessage = 'Error al registrar';
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.status === 0) {
        errorMessage = 'No hay conexión con el servidor';
      }
      
      // Aquí podrías mostrar un toast/alert con el error
      alert(errorMessage);
    } finally {
      this.loading = false;
    }
  }
  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  hasError(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted);
  }

}
