import { Routes } from '@angular/router';

import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';
import { LayoutComponent } from './features/shell/layout.component';


export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
    import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [authGuard, roleGuard(['admin'])],
        loadComponent: () =>
        import('./features/admin/pages/admin-dashboard.page').then(
          (m) => m.AdminDashboardPage,
        ),
      },
      {
        path: 'admin/users',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () =>
        import('./features/admin/pages/users.page').then((m) => m.UsersPage),
      },

      {
        path: 'coordinator',
        canActivate: [authGuard, roleGuard(['coordinator'])],
        loadComponent: () =>
        import('./features/coordinator/coordinator-dashboard.page').then(
          (m) => m.CoordinatorDashboardPage,
        ),
      },

      {
        path: 'observer',
        canActivate: [authGuard, roleGuard(['observer'])],
        loadComponent: () =>
        import('./features/observer/observer-dashboard.page').then(
          (m) => m.ObserverDashboardPage,
        ),
      },

    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];



