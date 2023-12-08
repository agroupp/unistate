import { Routes } from '@angular/router';

const ROUTES: Routes = [
  { path: 'google-boks', loadChildren: async () => await import('./google-books/google-books.routes') },
  { path: '', redirectTo: 'google-boks', pathMatch: 'full' },
];

export default ROUTES;
