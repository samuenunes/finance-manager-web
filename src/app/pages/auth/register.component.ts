
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../../shared/icons/icon.component';
import { cpfValidator } from '../../utils/cpf_validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, IconComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, cpfValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.errors?.['passwordMismatch']) {
      delete confirmPassword.errors['passwordMismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = '';

      const { confirmPassword, ...formValue } = this.registerForm.value;
      const userData = {
        ...formValue,
        cpf: formValue.cpf.replace(/\D/g, '') // <-- remove tudo que não for número
      };      

      this.authService.register(userData).subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.error = 'Erro ao criar conta: '+error.message;
          this.isLoading = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const fieldNames: { [key: string]: string } = {
          name: 'Nome',
          email: 'Email',
          cpf: 'CPF',
          password: 'Senha',
          confirmPassword: 'Confirmação de senha'
        };
        return `${fieldNames[fieldName]} é obrigatório`;
      }
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength']) {
        if (fieldName === 'password') return 'Senha deve ter pelo menos 6 caracteres';
        if (fieldName === 'name') return 'Nome deve ter pelo menos 2 caracteres';
      }
      if (field.errors['passwordMismatch']) return 'Senhas não coincidem';
      if (field.errors['cpf']) return 'CPF inválido';
    }
    return '';
  }
}
