
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { LucideIconComponent } from '../../shared/icons/lucide-icon.component';
import { ModalComponent } from '../../shared/components/modal.component';
import { User } from '../../models';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, ModalComponent],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Gerencie suas preferências e conta</p>
        </div>
        <button 
          type="button"
          class="btn-secondary flex items-center"
          (click)="goBack()">
          <app-lucide-icon name="arrow-left" [size]="20" class="mr-2"></app-lucide-icon>
          Voltar
        </button>
      </div>

      <!-- User Profile Card -->
      <div class="card p-6">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <app-lucide-icon name="user" [size]="32" class="text-white"></app-lucide-icon>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ currentUser?.name }}</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ currentUser?.email }}</p>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome
              </label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="input-field"
                [class.border-red-500]="getFieldError('name')"
                placeholder="Seu nome completo"
              />
              <p *ngIf="getFieldError('name')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ getFieldError('name') }}
              </p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input-field"
                [class.border-red-500]="getFieldError('email')"
                placeholder="seu@email.com"
              />
              <p *ngIf="getFieldError('email')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ getFieldError('email') }}
              </p>
            </div>
          </div>

          <div class="flex justify-end">
            <button 
              type="submit" 
              class="btn-primary flex items-center"
              [disabled]="!profileForm.valid || isUpdating">
              <app-lucide-icon name="save" [size]="20" class="mr-2"></app-lucide-icon>
              {{ isUpdating ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Theme Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <app-lucide-icon name="sun" [size]="20" class="mr-2"></app-lucide-icon>
          Aparência
        </h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-900 dark:text-white">Tema Escuro</p>
              <p class="text-sm text-gray-600 dark:text-gray-400">Alternar entre tema claro e escuro</p>
            </div>
            <button 
              type="button"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              [class]="isDarkMode ? 'bg-primary-600' : 'bg-gray-200'"
              (click)="toggleTheme()">
              <span 
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                [class]="isDarkMode ? 'translate-x-6' : 'translate-x-1'">
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <app-lucide-icon name="settings" [size]="20" class="mr-2"></app-lucide-icon>
          Segurança
        </h3>
        
        <div class="space-y-4">
          <button 
            type="button"
            class="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            (click)="showChangePasswordModal = true">
            <div class="flex items-center">
              <app-lucide-icon name="settings" [size]="20" class="mr-3 text-gray-400"></app-lucide-icon>
              <div class="text-left">
                <p class="font-medium text-gray-900 dark:text-white">Alterar Senha</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">Atualize sua senha de acesso</p>
              </div>
            </div>
            <app-lucide-icon name="chevron-right" [size]="20" class="text-gray-400"></app-lucide-icon>
          </button>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card p-6 border-red-200 dark:border-red-800">
        <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center">
          <app-lucide-icon name="alert-triangle" [size]="20" class="mr-2"></app-lucide-icon>
          Zona de Perigo
        </h3>
        
        <div class="space-y-4">
          <button 
            type="button"
            class="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            (click)="showLogoutModal = true">
            <div class="flex items-center">
              <app-lucide-icon name="log-out" [size]="20" class="mr-3 text-red-500"></app-lucide-icon>
              <div class="text-left">
                <p class="font-medium text-red-600 dark:text-red-400">Sair da Conta</p>
                <p class="text-sm text-red-500 dark:text-red-400">Encerrar sua sessão atual</p>
              </div>
            </div>
            <app-lucide-icon name="chevron-right" [size]="20" class="text-red-400"></app-lucide-icon>
          </button>
        </div>
      </div>

      <!-- Change Password Modal -->
      <app-modal 
        [isOpen]="showChangePasswordModal"
        title="Alterar Senha"
        confirmText="Alterar Senha"
        cancelText="Cancelar"
        (confirm)="changePassword()"
        (cancel)="closeChangePasswordModal()">
        
        <form [formGroup]="passwordForm" class="space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Senha Atual
            </label>
            <input
              id="currentPassword"
              type="password"
              formControlName="currentPassword"
              class="input-field"
              [class.border-red-500]="getPasswordFieldError('currentPassword')"
              placeholder="Digite sua senha atual"
            />
            <p *ngIf="getPasswordFieldError('currentPassword')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ getPasswordFieldError('currentPassword') }}
            </p>
          </div>

          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Senha
            </label>
            <input
              id="newPassword"
              type="password"
              formControlName="newPassword"
              class="input-field"
              [class.border-red-500]="getPasswordFieldError('newPassword')"
              placeholder="Digite sua nova senha"
            />
            <p *ngIf="getPasswordFieldError('newPassword')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ getPasswordFieldError('newPassword') }}
            </p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar Nova Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              class="input-field"
              [class.border-red-500]="getPasswordFieldError('confirmPassword')"
              placeholder="Confirme sua nova senha"
            />
            <p *ngIf="getPasswordFieldError('confirmPassword')" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ getPasswordFieldError('confirmPassword') }}
            </p>
          </div>
        </form>
      </app-modal>

      <!-- Logout Confirmation Modal -->
      <app-modal 
        [isOpen]="showLogoutModal"
        title="Confirmar Logout"
        confirmText="Sair"
        cancelText="Cancelar"
        (confirm)="logout()"
        (cancel)="showLogoutModal = false">
        
        <div class="flex items-center space-x-3">
          <app-lucide-icon name="alert-circle" [size]="24" class="text-amber-500"></app-lucide-icon>
          <p class="text-gray-600 dark:text-gray-300">
            Tem certeza que deseja sair da sua conta?
          </p>
        </div>
      </app-modal>
    </div>
  `
})
export class UserSettingsComponent implements OnInit {
  currentUser: User | null = null;
  isDarkMode = false;
  isUpdating = false;
  showChangePasswordModal = false;
  showLogoutModal = false;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });

    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  updateProfile(): void {
    if (this.profileForm.valid && !this.isUpdating) {
      this.isUpdating = true;
      
      // Simulate API call
      setTimeout(() => {
        this.toastService.success('Perfil atualizado com sucesso!');
        this.isUpdating = false;
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      
      if (newPassword !== confirmPassword) {
        this.toastService.error('As senhas não coincidem');
        return;
      }

      // Simulate API call
      setTimeout(() => {
        this.toastService.success('Senha alterada com sucesso!');
        this.closeChangePasswordModal();
      }, 1000);
    }
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
    this.passwordForm.reset();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.toastService.info('Logout realizado com sucesso');
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName === 'name' ? 'Nome' : 'Email'} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return `${fieldName === 'name' ? 'Nome' : 'Campo'} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return '';
  }

  getPasswordFieldError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const fieldNames: { [key: string]: string } = {
          currentPassword: 'Senha atual',
          newPassword: 'Nova senha',
          confirmPassword: 'Confirmação de senha'
        };
        return `${fieldNames[fieldName]} é obrigatória`;
      }
      if (field.errors['minlength']) return 'Senha deve ter pelo menos 6 caracteres';
    }
    return '';
  }
}
