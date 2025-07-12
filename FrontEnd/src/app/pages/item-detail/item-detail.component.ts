import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../models/item.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" *ngIf="item">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <a routerLink="/browse" class="text-gray-700 hover:text-primary-600">Browse</a>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-gray-500 md:ml-2">{{ item.title }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Image Gallery -->
        <div class="space-y-4">
          <div class="relative">
            <img 
              [src]="item.images[currentImageIndex]" 
              [alt]="item.title"
              class="w-full h-96 lg:h-[500px] object-cover rounded-lg">
            
            <!-- Image Navigation -->
            <button 
              *ngIf="item.images.length > 1"
              (click)="previousImage()"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <button 
              *ngIf="item.images.length > 1"
              (click)="nextImage()"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>

            <!-- Points Badge -->
            <div class="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {{ item.pointsValue }} points
            </div>

            <!-- Condition Badge -->
            <div class="absolute top-4 left-4">
              <span 
                [class]="getConditionClass(item.condition)"
                class="px-3 py-1 rounded-full text-sm font-medium">
                {{ item.condition }}
              </span>
            </div>
          </div>

          <!-- Thumbnail Navigation -->
          <div *ngIf="item.images.length > 1" class="flex space-x-2 overflow-x-auto">
            <button 
              *ngFor="let image of item.images; let i = index"
              (click)="setCurrentImage(i)"
              [class]="i === currentImageIndex ? 'ring-2 ring-primary-500' : ''"
              class="flex-shrink-0">
              <img 
                [src]="image" 
                [alt]="item.title"
                class="w-16 h-16 object-cover rounded-lg">
            </button>
          </div>
        </div>

        <!-- Item Details -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ item.title }}</h1>
            <p class="text-gray-600 text-lg">{{ item.description }}</p>
          </div>

          <!-- Item Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Category</span>
              <p class="text-gray-900">{{ item.category }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Type</span>
              <p class="text-gray-900">{{ item.type }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Size</span>
              <p class="text-gray-900">{{ item.size }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Condition</span>
              <p class="text-gray-900 capitalize">{{ item.condition }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div *ngIf="item.tags.length > 0">
            <span class="text-sm font-medium text-gray-500">Tags</span>
            <div class="flex flex-wrap gap-2 mt-2">
              <span 
                *ngFor="let tag of item.tags"
                class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Uploader Info -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center space-x-4">
              <img 
                [src]="item.userProfileImage" 
                [alt]="item.userName"
                class="w-12 h-12 rounded-full">
              <div>
                <p class="font-medium text-gray-900">Listed by {{ item.userName }}</p>
                <p class="text-sm text-gray-500">Member since {{ item.createdAt | date:'MMM yyyy' }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="border-t border-gray-200 pt-6 space-y-4">
            <div *ngIf="!isOwnItem && item.isAvailable">
              <button 
                (click)="requestSwap()"
                [disabled]="!isAuthenticated"
                class="w-full btn-primary py-3 text-lg">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Request Swap
              </button>
              
              <button 
                (click)="redeemWithPoints()"
                [disabled]="!isAuthenticated || !hasEnoughPoints"
                class="w-full btn-secondary py-3 text-lg mt-3">
                <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                Redeem with Points ({{ item.pointsValue }} pts)
              </button>
            </div>

            <div *ngIf="!isAuthenticated" class="text-center">
              <p class="text-gray-600 mb-4">Sign in to request swaps or redeem items</p>
              <button 
                (click)="navigateToLogin()"
                class="btn-primary">
                Sign In
              </button>
            </div>

            <div *ngIf="isOwnItem" class="text-center">
              <p class="text-gray-600 mb-4">This is your item</p>
              <button 
                (click)="navigateToDashboard()"
                class="btn-outline">
                Manage in Dashboard
              </button>
            </div>

            <div *ngIf="!item.isAvailable" class="text-center">
              <p class="text-red-600 font-medium">This item is no longer available</p>
            </div>
          </div>

          <!-- Points Info -->
          <div *ngIf="isAuthenticated && !isOwnItem" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Your points balance:</span>
              <span class="font-medium text-gray-900">{{ currentUser?.points }} points</span>
            </div>
            <div *ngIf="!hasEnoughPoints" class="mt-2 text-sm text-red-600">
              You need {{ item.pointsValue - (currentUser?.points || 0) }} more points to redeem this item
            </div>
          </div>
        </div>
      </div>

      <!-- Similar Items -->
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Similar Items</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            *ngFor="let similarItem of similarItems" 
            class="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            (click)="navigateToItem(similarItem.id)">
            <img 
              [src]="similarItem.images[0]" 
              [alt]="similarItem.title"
              class="w-full h-48 object-cover rounded-lg mb-4">
            <h3 class="font-semibold text-gray-900 mb-2">{{ similarItem.title }}</h3>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">{{ similarItem.pointsValue }} pts</span>
              <span 
                [class]="getConditionClass(similarItem.condition)"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ similarItem.condition }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!item" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="h-96 bg-gray-200 rounded-lg"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ItemDetailComponent implements OnInit {
  item: Item | undefined;
  currentImageIndex: number = 0;
  currentUser: User | null = null;
  similarItems: Item[] = [];
  isAuthenticated: boolean = false;
  isOwnItem: boolean = false;
  hasEnoughPoints: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadItem();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  loadItem(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    if (itemId) {
      this.itemService.getItemById(itemId).subscribe(item => {
        this.item = item;
        if (item) {
          this.isOwnItem = item.userId === this.currentUser?.id;
          this.hasEnoughPoints = (this.currentUser?.points || 0) >= item.pointsValue;
          this.loadSimilarItems(item);
        }
      });
    }
  }

  loadSimilarItems(currentItem: Item): void {
    this.itemService.getItems().subscribe(items => {
      this.similarItems = items
        .filter(item => 
          item.id !== currentItem.id && 
          item.isApproved && 
          item.isAvailable &&
          (item.category === currentItem.category || 
           item.tags.some(tag => currentItem.tags.includes(tag)))
        )
        .slice(0, 4);
    });
  }

  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.item && this.item.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.item.images.length;
    }
  }

  previousImage(): void {
    if (this.item && this.item.images.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.item.images.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  requestSwap(): void {
    if (!this.item || !this.currentUser) return;

    this.itemService.requestSwap(
      this.item.id, 
      this.currentUser.id, 
      this.currentUser.name
    ).subscribe(() => {
      alert('Swap request sent successfully!');
    });
  }

  redeemWithPoints(): void {
    if (!this.item || !this.currentUser) return;

    if (confirm(`Are you sure you want to redeem this item for ${this.item.pointsValue} points?`)) {
      this.itemService.redeemWithPoints(this.item.id, this.currentUser.id).subscribe(success => {
        if (success) {
          // Update user points
          const newPoints = (this.currentUser?.points || 0) - this.item!.pointsValue;
          this.authService.updatePoints(newPoints);
          this.currentUser = this.authService.getCurrentUser();
          this.hasEnoughPoints = false;
          alert('Item redeemed successfully!');
        } else {
          alert('Failed to redeem item. Please try again.');
        }
      });
    }
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

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToItem(itemId: string): void {
    this.router.navigate(['/item', itemId]);
  }
} 