
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.error = 'Email ou senha inválidos';
          this.isLoading = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName === 'email' ? 'Email' : 'Senha'} é obrigatório`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) return 'Senha deve ter pelo menos 6 caracteres';
    }
    return '';
  }
}
