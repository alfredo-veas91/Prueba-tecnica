import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // Aquí puedes simular que no hay sesión iniciada
    const isLoggedIn = false;

    if (!isLoggedIn) {
      this.router.navigateByUrl('/login');
    }
  }
}