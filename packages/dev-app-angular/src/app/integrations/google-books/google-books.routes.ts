import { Routes } from '@angular/router';

const ROUTES: Routes = [{ path: '', loadComponent: async () => (await import('./books.component')).BooksComponent }];

export default ROUTES;
