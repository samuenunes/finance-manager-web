
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register.component').then(m => m.RegisterComponent),
    canActivate: [GuestGuard]
  },

  // Protected routes with layout
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'expenses',
        loadComponent: () => import('./pages/expenses/expenses.component').then(m => m.ExpensesComponent)
      },
      {
        path: 'incomes',
        loadComponent: () => import('./pages/incomes/incomes.component').then(m => m.IncomesComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/user-settings/user-settings.component').then(m => m.UserSettingsComponent)
      }
    ]
  },

  // Redirect authenticated users to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Wildcard route - must be last
  {
    path: '**',
    redirectTo: '/'
  }
];
