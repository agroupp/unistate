import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: 'integrations', loadChildren: async () => await import('./integrations/integrations.routes') },
  { path: '', redirectTo: 'integrations', pathMatch: 'full' },
];
