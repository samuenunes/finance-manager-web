
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  features = [
    {
      icon: 'chart-bar',
      title: 'Dashboard Intuitivo',
      description: 'Visualize suas finanças com gráficos e relatórios detalhados'
    },
    {
      icon: 'wallet',
      title: 'Controle de Gastos',
      description: 'Gerencie suas despesas e receitas de forma organizada'
    },
    {
      icon: 'target',
      title: 'Metas Financeiras',
      description: 'Defina e acompanhe suas metas de economia e investimento'
    },
    {
      icon: 'shield-check',
      title: 'Segurança Total',
      description: 'Seus dados financeiros protegidos com criptografia avançada'
    }
  ];
}
