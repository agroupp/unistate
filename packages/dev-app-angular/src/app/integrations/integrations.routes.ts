import { Routes } from '@angular/router';

const ROUTES: Routes = [
  { path: 'google-books', loadChildren: async () => await import('./google-books/google-books.routes') },
  { path: '', redirectTo: 'google-books', pathMatch: 'full' },
];

export default ROUTES;
