import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'basic', loadComponent: () => import('./basic/basic.component').then(m => m.BasicComponent) },
  { path: 'multi-featured', loadChildren: async () => await import('./multi-featured/multi-featured.routes') },
  { path: 'integrations', loadChildren: async () => await import('./integrations/integrations.routes') },
  { path: '', redirectTo: 'integrations', pathMatch: 'full' },
];
