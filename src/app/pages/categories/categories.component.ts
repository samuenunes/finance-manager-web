
import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoryService } from '../../services/expense-category.service';
import { IncomeCategoryService } from '../../services/income-category.service';
import { ExpenseCategoryResponse, IncomeCategoryResponse, ExpenseCategoryRequest, IncomeCategoryRequest } from '../../models';
import { IconComponent } from '../../shared/icons/icon.component';
import { LoadingComponent } from '../../shared/components/loading.component';
import { ModalComponent } from '../../shared/components/modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, LoadingComponent, ModalComponent],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {
  expenseCategories: ExpenseCategoryResponse[] = [];
  incomeCategories: IncomeCategoryResponse[] = [];
  isLoading = true;
  isSubmitting = false;
  showModal = false;
  activeTab: 'expenses' | 'incomes' = 'expenses';
  editingCategory: ExpenseCategoryResponse | IncomeCategoryResponse | null = null;
  deleteCategoryId: number | null = null;
  showDeleteModal = false;

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expenseCategoryService: ExpenseCategoryService,
    private incomeCategoryService: IncomeCategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      fixed: [false],
      essential: [false] // Only for expense categories
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    
    Promise.all([
      this.expenseCategoryService.getAll().toPromise(),
      this.incomeCategoryService.getAll().toPromise()
    ]).then(([expenseCategories, incomeCategories]) => {
      this.expenseCategories = expenseCategories || [];
      this.incomeCategories = incomeCategories || [];
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading data:', error);
      this.isLoading = false;
    });
  }

  setActiveTab(tab: 'expenses' | 'incomes'): void {
    this.activeTab = tab;
  }

  openModal(category?: ExpenseCategoryResponse | IncomeCategoryResponse): void {
    this.editingCategory = category || null;
    this.showModal = true;

    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
        fixed: category.fixed,
        essential: 'essential' in category ? category.essential : false
      });
    } else {
      this.categoryForm.reset();
      this.categoryForm.patchValue({
        fixed: false,
        essential: false
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  onSubmit(): void {
    if (this.categoryForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formValue = this.categoryForm.value;

      if (this.activeTab === 'expenses') {
        const categoryData: ExpenseCategoryRequest = {
          name: formValue.name,
          fixed: formValue.fixed,
          essential: formValue.essential
        };

        if (this.editingCategory) {
          this.expenseCategoryService.update(this.editingCategory.id, categoryData).subscribe({
            next: () => {
              this.loadData();
              this.closeModal();
              this.isSubmitting = false;
            },
            error: (error) => {
              console.error('Error updating expense category:', error);
              this.isSubmitting = false;
            }
          });
        } else {
          this.expenseCategoryService.create(categoryData).subscribe({
            next: () => {
              this.loadData();
              this.closeModal();
              this.isSubmitting = false;
            },
            error: (error) => {
              console.error('Error creating expense category:', error);
              this.isSubmitting = false;
            }
          });
        }
      } else {
        const categoryData: IncomeCategoryRequest = {
          name: formValue.name,
          fixed: formValue.fixed
        };

        if (this.editingCategory) {
          this.incomeCategoryService.update(this.editingCategory.id, categoryData).subscribe({
            next: () => {
              this.loadData();
              this.closeModal();
              this.isSubmitting = false;
            },
            error: (error) => {
              console.error('Error updating income category:', error);
              this.isSubmitting = false;
            }
          });
        } else {
          this.incomeCategoryService.create(categoryData).subscribe({
            next: () => {
              this.loadData();
              this.closeModal();
              this.isSubmitting = false;
            },
            error: (error) => {
              console.error('Error creating income category:', error);
              this.isSubmitting = false;
            }
          });
        }
      }
    }
  }

  confirmDelete(categoryId: number): void {
    this.deleteCategoryId = categoryId;
    this.showDeleteModal = true;
  }

  deleteCategory(): void {
    if (this.deleteCategoryId) {
      const deleteObservable = this.activeTab === 'expenses' 
        ? this.expenseCategoryService.delete(this.deleteCategoryId)
        : this.incomeCategoryService.delete(this.deleteCategoryId);

      deleteObservable.subscribe({
        next: () => {
          this.loadData();
          this.showDeleteModal = false;
          this.deleteCategoryId = null;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.showDeleteModal = false;
          this.deleteCategoryId = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.deleteCategoryId = null;
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Nome é obrigatório';
      }
    }
    return '';
  }

  isExpenseCategory(category: any): category is ExpenseCategoryResponse {
    return 'essential' in category;
  }
}
