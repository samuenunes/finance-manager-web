import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { LucideIconComponent } from '../../shared/icons/lucide-icon.component';
import { User } from '../../models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideIconComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  isDarkMode = false;
  isSidebarOpen = true;
  isSidebarExpanded = true;
  isUserMenuOpen = false;
  isDesktop = true;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'layout-dashboard',
      route: '/dashboard',
      active: true
    },
    {
      label: 'Receitas',
      icon: 'trending-up',
      route: '/incomes',
      active: false
    },
    {
      label: 'Despesas',
      icon: 'trending-down',
      route: '/expenses',
      active: false
    },
    {
      label: 'Categorias',
      icon: 'tag',
      route: '/categories',
      active: false
    }
  ];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });

    // Update active menu item based on current route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateActiveMenuItem();
      });
    
    this.updateActiveMenuItem();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkScreenSize(): void {
    this.isDesktop = window.innerWidth >= 1024;
    if (!this.isDesktop) {
      this.isSidebarOpen = false;
      this.isSidebarExpanded = true; // Always expanded on mobile when open
    } else {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleSidebarExpansion(): void {
    if (this.isDesktop) {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.toastService.info(`Tema ${!this.isDarkMode ? 'escuro' : 'claro'} ativado`);
  }

  openSettings(): void {
    this.isUserMenuOpen = false;
    this.router.navigate(['/settings']);
  }

  logout(): void {
    this.authService.logout();
    this.toastService.success('Logout realizado com sucesso');
    this.router.navigate(['/']);
  }

  getPageTitle(): string {
    const route = this.router.url;
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/incomes': 'Receitas',
      '/expenses': 'Despesas',
      '/categories': 'Categorias',
      '/settings': 'Configurações'
    };
    
    for (const path in titles) {
      if (route.startsWith(path)) {
        return titles[path];
      }
    }
    
    return 'Finance Manager';
  }

  private updateActiveMenuItem(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.active = currentRoute.startsWith(item.route);
    });
  }
}
