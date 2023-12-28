import { Routes } from '@angular/router';

const ROUTES: Routes = [{ path: '', loadComponent: () => import('./feature-two.component').then(m => m.FeatureTwoComponent) }];

export default ROUTES;
