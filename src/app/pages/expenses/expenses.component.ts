
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseCategoryService } from '../../services/expense-category.service';
import { ToastService } from '../../services/toast.service';
import { ExpenseResponse, ExpenseCategoryResponse, ExpenseRequest } from '../../models';
import { DateUtils } from '../../utils/date.utils';
import { CurrencyUtils } from '../../utils/currency.utils';
import { LucideIconComponent } from '../../shared/icons/lucide-icon.component';
import { LoadingComponent } from '../../shared/components/loading.component';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideIconComponent, LoadingComponent, ModalComponent],
  templateUrl: './expenses.component.html'
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseResponse[] = [];
  categories: ExpenseCategoryResponse[] = [];
  isLoading = true;
  isSubmitting = false;
  showModal = false;
  editingExpense: ExpenseResponse | null = null;
  deleteExpenseId: number | null = null;
  showDeleteModal = false;

  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private expenseCategoryService: ExpenseCategoryService,
    private toastService: ToastService
  ) {
    this.expenseForm = this.fb.group({
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
      this.expenseService.getAll().toPromise(),
      this.expenseCategoryService.getAll().toPromise()
    ]).then(([expenses, categories]) => {
      this.expenses = expenses || [];
      this.categories = categories || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false;
    });
  }

  openModal(expense?: ExpenseResponse): void {
    this.editingExpense = expense || null;
    this.showModal = true;

    if (expense) {
      const expenseDate = DateUtils.parseFromApiDate(expense.date);
      this.expenseForm.patchValue({
        description: expense.description,
        amount: expense.amount,
        category: expense.category.id,
        date: DateUtils.formatToInputDate(expenseDate)
      });
    } else {
      this.expenseForm.reset();
      this.expenseForm.patchValue({
        date: DateUtils.formatToInputDate(new Date())
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingExpense = null;
    this.expenseForm.reset();
  }

  onSubmit(): void {
    if (this.expenseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.expenseForm.value;
      const expenseData: ExpenseRequest = {
        description: formValue.description,
        amount: parseFloat(formValue.amount),
        category: parseInt(formValue.category),
        date: DateUtils.formatToApiDate(DateUtils.parseFromInputDate(formValue.date))
      };

      const operation = this.editingExpense 
        ? this.expenseService.update(this.editingExpense.id, expenseData)
        : this.expenseService.create(expenseData);

      operation.subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.isSubmitting = false;
          this.toastService.success(
            this.editingExpense ? 'Despesa atualizada com sucesso!' : 'Despesa criada com sucesso!'
          );
        },
        error: (error) => {
          console.error('Error saving expense:', error);
          this.isSubmitting = false;
          this.toastService.error('Erro ao salvar despesa. Tente novamente.');
        }
      });
    }
  }

  confirmDelete(expenseId: number): void {
    this.deleteExpenseId = expenseId;
    this.showDeleteModal = true;
  }

  deleteExpense(): void {
    if (this.deleteExpenseId) {
      this.expenseService.delete(this.deleteExpenseId).subscribe({
        next: () => {
          this.loadData();
          this.showDeleteModal = false;
          this.deleteExpenseId = null;
          this.toastService.success('Despesa excluída com sucesso!');
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
          this.showDeleteModal = false;
          this.deleteExpenseId = null;
          this.toastService.error('Erro ao excluir despesa. Tente novamente.');
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteExpenseId = null;
  }

  formatCurrency(value: number): string {
    return CurrencyUtils.formatBRL(value);
  }

  formatDate(dateString: string): string {
    const date = DateUtils.parseFromApiDate(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  getFieldError(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
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
