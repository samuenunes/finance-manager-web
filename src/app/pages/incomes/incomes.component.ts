
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { IncomeCategoryService } from '../../services/income-category.service';
import { ToastService } from '../../services/toast.service';
import { IncomeResponse, IncomeCategoryResponse, IncomeRequest } from '../../models';
import { DateUtils } from '../../utils/date.utils';
import { CurrencyUtils } from '../../utils/currency.utils';
import { LucideIconComponent } from '../../shared/icons/lucide-icon.component';
import { LoadingComponent } from '../../shared/components/loading.component';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-incomes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, LoadingComponent, ModalComponent],
  templateUrl: './incomes.component.html'
})
export class IncomesComponent implements OnInit {
  incomes: IncomeResponse[] = [];
  categories: IncomeCategoryResponse[] = [];
  isLoading = true;
  isSubmitting = false;
  showModal = false;
  editingIncome: IncomeResponse | null = null;
  deleteIncomeId: number | null = null;
  showDeleteModal = false;

  incomeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private incomeService: IncomeService,
    private incomeCategoryService: IncomeCategoryService,
    private toastService: ToastService
  ) {
    this.incomeForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    
    Promise.all([
      this.incomeService.getAll().toPromise(),
      this.incomeCategoryService.getAll().toPromise()
    ]).then(([incomes, categories]) => {
      this.incomes = incomes || [];
      this.categories = categories || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false;
    });
  }

  openModal(income?: IncomeResponse): void {
    this.editingIncome = income || null;
    this.showModal = true;

    if (income) {
      const incomeDate = DateUtils.parseFromApiDate(income.date);
      this.incomeForm.patchValue({
        description: income.description,
        amount: income.amount,
        category: income.category.id,
        date: DateUtils.formatToInputDate(incomeDate)
      });
    } else {
      this.incomeForm.reset();
      this.incomeForm.patchValue({
        date: DateUtils.formatToInputDate(new Date())
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingIncome = null;
    this.incomeForm.reset();
  }

  onSubmit(): void {
    if (this.incomeForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.incomeForm.value;
      const incomeData: IncomeRequest = {
        description: formValue.description,
        amount: parseFloat(formValue.amount),
        category: parseInt(formValue.category),
        date: DateUtils.formatToApiDate(DateUtils.parseFromInputDate(formValue.date))
      };

      const operation = this.editingIncome 
        ? this.incomeService.update(this.editingIncome.id, incomeData)
        : this.incomeService.create(incomeData);

      operation.subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.isSubmitting = false;
          this.toastService.success(
            this.editingIncome ? 'Receita atualizada com sucesso!' : 'Receita criada com sucesso!'
          );
        },
        error: (error) => {
          console.error('Error saving income:', error);
          this.isSubmitting = false;
          this.toastService.error('Erro ao salvar receita. Tente novamente.');
        }
      });
    }
  }

  confirmDelete(incomeId: number): void {
    this.deleteIncomeId = incomeId;
    this.showDeleteModal = true;
  }

  deleteIncome(): void {
    if (this.deleteIncomeId) {
      this.incomeService.delete(this.deleteIncomeId).subscribe({
        next: () => {
          this.loadData();
          this.showDeleteModal = false;
          this.deleteIncomeId = null;
          this.toastService.success('Receita excluída com sucesso!');
        },
        error: (error) => {
          console.error('Error deleting income:', error);
          this.showDeleteModal = false;
          this.deleteIncomeId = null;
          this.toastService.error('Erro ao excluir receita. Tente novamente.');
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteIncomeId = null;
  }

  formatCurrency(value: number): string {
    return CurrencyUtils.formatBRL(value);
  }

  formatDate(dateString: string): string {
    const date = DateUtils.parseFromApiDate(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  getFieldError(fieldName: string): string {
    const field = this.incomeForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        const fieldNames: { [key: string]: string } = {
          description: 'Descrição',
          amount: 'Valor',
          category: 'Categoria',
          date: 'Data'
        };
        return `${fieldNames[fieldName]} é obrigatório`;
      }
      if (field.errors['min']) return 'Valor deve ser maior que zero';
    }
    return '';
  }
}
