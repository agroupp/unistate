import { Routes } from '@angular/router';

const ROUTES: Routes = [{ path: '', loadComponent: () => import('./feature-one.component').then(m => m.FeatureOneComponent) }];

export default ROUTES;
