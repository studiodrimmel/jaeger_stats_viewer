import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
    {
        path: '',
        title: 'Dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
    },
];
