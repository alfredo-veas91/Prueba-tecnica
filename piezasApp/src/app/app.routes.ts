import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'home-page',
    loadComponent: () => import('./home-page/home-page.page').then( m => m.HomePagePage)
  },
  {
    path: 'categorias',
    loadComponent: () => import('./categorias/categorias.page').then( m => m.CategoriasPage)
  },
  {
    path: 'create-categoria',
    loadComponent: () => import('./create-categoria/create-categoria.page').then( m => m.CreateCategoriaPage)
  },
  {
    path: 'update-categoria/:id',
    loadComponent: () => import('./update-categoria/update-categoria.page').then( m => m.UpdateCategoriaPage)
  },
  {
    path: 'piezas',
    loadComponent: () => import('./piezas/piezas.page').then( m => m.PiezasPage)
  },
  {
    path: 'create-pieza',
    loadComponent: () => import('./create-pieza/create-pieza.page').then( m => m.CreatePiezaPage)
  },
  {
    path: 'details-pieza/:id',
    loadComponent: () => import('./details-pieza/details-pieza.page').then( m => m.DetailsPiezaPage)
  },
  {
    path: 'edit-pieza/:id',
    loadComponent: () => import('./edit-pieza/edit-pieza.page').then( m => m.EditPiezaPage)
  },
];
