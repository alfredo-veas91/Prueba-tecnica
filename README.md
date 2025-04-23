# Prueba tecnica

Alfredo veas

Consiste en una api-backend desarrollado en Laravel 11 con una base de datos sqlLite y un frontend desarrollado en Ionic 7.2.1


# Estructura del proyecto
mi-repo/
├── api-backend/          # Proyecto Laravel Backend
│   
│
├── piezasApp/         # Proyecto Ionic Frontend
│   
# Instalación

## Backend (Laravel)
1. `cd api-backend`
2. `composer install`
3. Copiar `.env.example` a `.env`
4. Configurar credenciales de DB en `.env`
5. `php artisan key:generate`
6. `php artisan migrate --seed`

## Frontend (Ionic)
1. `cd piezasApp`
2. `npm install`
3. Configurar `environment.ts` con la URL de la API
4. `ionic serve`

## Ejecucion del proyecto en localhost
1. Levantar servidor de laravel `php artisan serve`
2. En una terminal aparte, levantar servidor de ionic `ionic serve`