import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">List a New Item</h1>
        <p class="text-gray-600 mt-2">Share your unused clothing with the community</p>
      </div>

      <form (ngSubmit)="onSubmit()" #addItemForm="ngForm" class="space-y-8">
        <!-- Image Upload Section -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Photos</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                *ngFor="let image of selectedImages; let i = index"
                class="relative">
                <img 
                  [src]="image" 
                  alt="Item preview"
                  class="w-full h-32 object-cover rounded-lg">
                <button 
                  type="button"
                  (click)="removeImage(i)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div 
                *ngIf="selectedImages.length < 4"
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors"
                (click)="triggerFileInput()">
                <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="text-sm text-gray-500">Add Photo</span>
              </div>
            </div>
            
            <input 
              #fileInput
              type="file" 
              accept="image/*" 
              multiple
              (change)="onFileSelected($event)"
              class="hidden">
            
            <p class="text-sm text-gray-500">
              Upload up to 4 photos. First photo will be the main image.
            </p>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                [(ngModel)]="itemData.title"
                required
                class="input-field"
                placeholder="e.g., Vintage Denim Jacket">
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                [(ngModel)]="itemData.category"
                required
                class="input-field">
                <option value="">Select Category</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Dresses">Dresses</option>
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
              </select>
            </div>

            <div>
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <input
                id="type"
                name="type"
                type="text"
                [(ngModel)]="itemData.type"
                required
                class="input-field"
                placeholder="e.g., Jacket, Dress, Shirt">
            </div>

            <div>
              <label for="size" class="block text-sm font-medium text-gray-700 mb-1">
                Size *
              </label>
              <select
                id="size"
                name="size"
                [(ngModel)]="itemData.size"
                required
                class="input-field">
                <option value="">Select Size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="One Size">One Size</option>
              </select>
            </div>
          </div>

          <div class="mt-6">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              [(ngModel)]="itemData.description"
              required
              rows="4"
              class="input-field"
              placeholder="Describe your item in detail..."></textarea>
          </div>
        </div>

        <!-- Condition and Points -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Condition & Points</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="condition" class="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                [(ngModel)]="itemData.condition"
                required
                class="input-field">
                <option value="">Select Condition</option>
                <option value="excellent">Excellent - Like new, no visible wear</option>
                <option value="good">Good - Minor wear, still in great shape</option>
                <option value="fair">Fair - Some wear, but still wearable</option>
                <option value="poor">Poor - Significant wear, but functional</option>
              </select>
            </div>

            <div>
              <label for="pointsValue" class="block text-sm font-medium text-gray-700 mb-1">
                Points Value *
              </label>
              <input
                id="pointsValue"
                name="pointsValue"
                type="number"
                [(ngModel)]="itemData.pointsValue"
                required
                min="1"
                max="1000"
                class="input-field"
                placeholder="Enter points value (1-1000)">
              <p class="text-sm text-gray-500 mt-1">
                Suggested: Excellent (50-100), Good (30-50), Fair (15-30), Poor (5-15)
              </p>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
          <div class="space-y-4">
            <div>
              <label for="tagInput" class="block text-sm font-medium text-gray-700 mb-1">
                Add Tags
              </label>
              <div class="flex space-x-2">
                <input
                  id="tagInput"
                  type="text"
                  [(ngModel)]="newTag"
                  (keyup.enter)="addTag()"
                  class="input-field flex-1"
                  placeholder="e.g., vintage, denim, casual">
                <button 
                  type="button"
                  (click)="addTag()"
                  class="btn-primary">
                  Add
                </button>
              </div>
            </div>

            <div *ngIf="itemData.tags.length > 0" class="flex flex-wrap gap-2">
              <span 
                *ngFor="let tag of itemData.tags; let i = index"
                class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <span>{{ tag }}</span>
                <button 
                  type="button"
                  (click)="removeTag(i)"
                  class="text-primary-600 hover:text-primary-800">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </span>
            </div>

            <p class="text-sm text-gray-500">
              Add relevant tags to help others find your item. Examples: vintage, denim, casual, formal, summer, winter
            </p>
          </div>
        </div>

        <!-- Submit Section -->
        <div class="flex items-center justify-between">
          <button 
            type="button"
            (click)="navigateToBrowse()"
            class="btn-outline">
            Cancel
          </button>
          
          <button 
            type="submit"
            [disabled]="!addItemForm.form.valid || selectedImages.length === 0 || isLoading"
            class="btn-primary">
            <span *ngIf="isLoading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
            <span *ngIf="!isLoading">List Item</span>
          </button>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  `
})
export class AddItemComponent implements OnInit {
  itemData = {
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '' as 'excellent' | 'good' | 'fair' | 'poor',
    tags: [] as string[],
    pointsValue: 0
  };

  selectedImages: string[] = [];
  newTag: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  currentUser: User | null = null;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length && this.selectedImages.length < 4; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedImages.push(e.target.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  addTag(): void {
    if (this.newTag.trim() && !this.itemData.tags.includes(this.newTag.trim())) {
      this.itemData.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number): void {
    this.itemData.tags.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.currentUser) {
      this.errorMessage = 'You must be logged in to list an item';
      return;
    }

    if (this.selectedImages.length === 0) {
      this.errorMessage = 'Please upload at least one photo';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newItem = {
      ...this.itemData,
      images: this.selectedImages,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userProfileImage: this.currentUser.profileImage,
      isAvailable: true
    };

    this.itemService.addItem(newItem).subscribe({
      next: (item) => {
        this.isLoading = false;
        alert('Item listed successfully! It will be reviewed by our team before going live.');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to list item. Please try again.';
      }
    });
  }

  navigateToBrowse(): void {
    this.router.navigate(['/browse']);
  }
} 