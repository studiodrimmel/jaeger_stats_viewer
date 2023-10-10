import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
    {
        path: '',
        title: 'Process Info',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(c => c.DashboardComponent)
    },
    {
        path: 'file-stats',
        title: 'File Stats',
        loadComponent: () => import('./pages/file-stats/file-stats.component').then(c => c.FileStatsComponent)
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: '',
    },
];
