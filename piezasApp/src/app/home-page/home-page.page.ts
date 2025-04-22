import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '../components/side-menu/side-menu.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    RouterModule,
    SideMenuComponent
  ]
})
export class HomePagePage {
  @ViewChild(SideMenuComponent) sideMenu!: SideMenuComponent;

  // Método para abrir/cerrar el menú
  toggleMenu() {
    this.sideMenu.toggleMenu();
  }
}