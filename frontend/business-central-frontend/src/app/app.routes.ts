import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'editor/:type', 
    loadComponent: () => import('./components/editor/editor.component').then(m => m.EditorComponent)
  },
  { 
    path: 'editor/:type/:id', 
    loadComponent: () => import('./components/editor/editor.component').then(m => m.EditorComponent)
  },
  { 
    path: 'execute/:id', 
    loadComponent: () => import('./components/execution/execution.component').then(m => m.ExecutionComponent)
  }
];
