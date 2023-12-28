import { Routes } from '@angular/router';

const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./multi-featured.component').then(m => m.MultiFeaturedComponent),
    children: [
      { path: 'one', loadChildren: async () => await import('./feature-one/feature-one.routes') },
      { path: 'two', loadChildren: async () => await import('./feature-two/feature-two.routes') },
    ],
  },
];

export default ROUTES;
