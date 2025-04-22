import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(private router: Router, private location: Location) {
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
} 