import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SideMenuComponent {
  isMenuOpen = false;
  navigationHistory: string[] = [];
  
  @Output() menuToggled = new EventEmitter<boolean>();

  constructor(private router: Router, private location: Location, private toastCtrl: ToastController, private apiService: ApiService) {
    this.router.events.subscribe((event) => {
      if (this.isMenuOpen) {
        this.navigationHistory.push(this.router.url);
      }
    });
  } 
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.navigationHistory.push(this.router.url);
    }
    this.menuToggled.emit(this.isMenuOpen);
  }

  goBack() {
    if (this.navigationHistory.length > 0) {
      const previousUrl = this.navigationHistory.pop();
      this.router.navigateByUrl(previousUrl || '/');
    } else {
      this.location.back();
    }
    this.isMenuOpen = false;
    this.menuToggled.emit(false);
  }

  async logout() {
    try {
      // Llama al endpoint de logout de tu API
      await this.apiService.logout().toPromise();
      
      // Limpia el token y cualquier dato de usuario
      localStorage.removeItem('auth_token');
      
      // Muestra mensaje de éxito
      const toast = await this.toastCtrl.create({
        message: 'Sesión cerrada correctamente',
        duration: 2000,
        position: 'bottom'
      });
      await toast.present();
      
      // Redirige al login
      this.router.navigate(['/login']);
      
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error al cerrar sesión',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }
} 