import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Browse Items</h1>
        <p class="text-gray-600 mt-2">Discover amazing pieces from our community</p>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              id="search"
              type="text"
              [(ngModel)]="searchTerm"
              (input)="filterItems()"
              placeholder="Search items..."
              class="input-field">
          </div>

          <!-- Category Filter -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              id="category"
              [(ngModel)]="selectedCategory"
              (change)="filterItems()"
              class="input-field">
              <option value="">All Categories</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Dresses">Dresses</option>
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Accessories">Accessories</option>
              <option value="Shoes">Shoes</option>
            </select>
          </div>

          <!-- Size Filter -->
          <div>
            <label for="size" class="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <select
              id="size"
              [(ngModel)]="selectedSize"
              (change)="filterItems()"
              class="input-field">
              <option value="">All Sizes</option>
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

        <!-- Additional Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label for="condition" class="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              id="condition"
              [(ngModel)]="selectedCondition"
              (change)="filterItems()"
              class="input-field">
              <option value="">All Conditions</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>

          <div>
            <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              id="sortBy"
              [(ngModel)]="sortBy"
              (change)="filterItems()"
              class="input-field">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="points-low">Points: Low to High</option>
              <option value="points-high">Points: High to Low</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              (click)="clearFilters()"
              class="btn-outline w-full">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Results Count -->
      <div class="flex items-center justify-between mb-6">
        <p class="text-gray-600">
          Showing {{ filteredItems.length }} of {{ allItems.length }} items
        </p>
        <div class="flex items-center space-x-2">
          <button
            (click)="setViewMode('grid')"
            [class]="viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'"
            class="p-2 rounded-lg hover:bg-primary-50 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </button>
          <button
            (click)="setViewMode('list')"
            [class]="viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'"
            class="p-2 rounded-lg hover:bg-primary-50 transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Items Grid -->
      <div 
        [class]="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'">
        
        <!-- Grid View -->
        <div 
          *ngFor="let item of filteredItems" 
          [class]="viewMode === 'grid' ? 'card hover:shadow-lg transition-shadow duration-300 cursor-pointer' : 'card hover:shadow-md transition-shadow duration-300 cursor-pointer'"
          (click)="navigateToItem(item.id)">
          
          <!-- Grid Layout -->
          <div *ngIf="viewMode === 'grid'">
            <div class="relative mb-4">
              <img 
                [src]="item.images[0]" 
                [alt]="item.title"
                class="w-full h-64 object-cover rounded-lg">
              <div class="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                {{ item.pointsValue }} pts
              </div>
              <div class="absolute top-2 left-2">
                <span 
                  [class]="getConditionClass(item.condition)"
                  class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ item.condition }}
                </span>
              </div>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ item.description }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img 
                  [src]="item.userProfileImage" 
                  [alt]="item.userName"
                  class="w-6 h-6 rounded-full">
                <span class="text-sm text-gray-600">{{ item.userName }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ item.size }}</span>
            </div>
          </div>

          <!-- List Layout -->
          <div *ngIf="viewMode === 'list'" class="flex items-center space-x-4">
            <img 
              [src]="item.images[0]" 
              [alt]="item.title"
              class="w-24 h-24 object-cover rounded-lg">
            
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ item.title }}</h3>
                <div class="flex items-center space-x-2">
                  <span 
                    [class]="getConditionClass(item.condition)"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ item.condition }}
                  </span>
                  <span class="bg-primary-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                    {{ item.pointsValue }} pts
                  </span>
                </div>
              </div>
              
              <p class="text-gray-600 text-sm mb-2">{{ item.description }}</p>
              
              <div class="flex items-center justify-between text-sm text-gray-500">
                <div class="flex items-center space-x-4">
                  <span>{{ item.category }}</span>
                  <span>{{ item.size }}</span>
                  <div class="flex items-center space-x-2">
                    <img 
                      [src]="item.userProfileImage" 
                      [alt]="item.userName"
                      class="w-5 h-5 rounded-full">
                    <span>{{ item.userName }}</span>
                  </div>
                </div>
                <span>{{ item.createdAt | date:'shortDate' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div *ngIf="filteredItems.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No items found</h3>
        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        <div class="mt-6">
          <button 
            (click)="clearFilters()"
            class="btn-primary">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  `
})
export class BrowseComponent implements OnInit {
  allItems: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedSize: string = '';
  selectedCondition: string = '';
  sortBy: string = 'newest';
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.allItems = items.filter(item => item.isApproved && item.isAvailable);
      this.filterItems();
    });
  }

  filterItems(): void {
    let filtered = [...this.allItems];

    // Search filter
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    // Size filter
    if (this.selectedSize) {
      filtered = filtered.filter(item => item.size === this.selectedSize);
    }

    // Condition filter
    if (this.selectedCondition) {
      filtered = filtered.filter(item => item.condition === this.selectedCondition);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'points-low':
          return a.pointsValue - b.pointsValue;
        case 'points-high':
          return b.pointsValue - a.pointsValue;
        default:
          return 0;
      }
    });

    this.filteredItems = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedSize = '';
    this.selectedCondition = '';
    this.sortBy = 'newest';
    this.filterItems();
  }

  setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  getConditionClass(condition: string): string {
    switch (condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  navigateToItem(itemId: string): void {
    this.router.navigate(['/item', itemId]);
  }
} 