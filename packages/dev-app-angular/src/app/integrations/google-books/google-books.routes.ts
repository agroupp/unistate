import { Routes } from '@angular/router';

import { BooksService } from './books.service';
import { BooksStore } from './books.store';

const ROUTES: Routes = [
  { path: '', loadComponent: async () => (await import('./books.component')).BooksComponent, providers: [BooksService, BooksStore] },
];

export default ROUTES;
