import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { User } from '../../models/user.model';
import { Item } from '../../models/item.model';
import { SwapRequest } from '../../models/item.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{ currentUser?.name }}!</h1>
        <p class="text-gray-600 mt-2">Manage your items and track your swaps</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Points Balance</p>
              <p class="text-2xl font-bold text-gray-900">{{ currentUser?.points }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Listed Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ myItems.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Swaps</p>
              <p class="text-2xl font-bold text-gray-900">{{ pendingSwaps.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completed</p>
              <p class="text-2xl font-bold text-gray-900">{{ completedSwaps.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- My Items -->
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">My Listed Items</h2>
            <button 
              (click)="navigateToAddItem()"
              class="btn-primary text-sm">
              Add New Item
            </button>
          </div>
          
          <div class="space-y-4">
            <div 
              *ngFor="let item of myItems" 
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center space-x-4">
                <img 
                  [src]="item.images[0]" 
                  [alt]="item.title"
                  class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
                  <p class="text-sm text-gray-600">{{ item.pointsValue }} points</p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span 
                      [class]="getStatusClass(item.isAvailable, item.isApproved)"
                      class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ getStatusText(item.isAvailable, item.isApproved) }}
                    </span>
                  </div>
                </div>
                <button 
                  (click)="navigateToItem(item.id)"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View
                </button>
              </div>
            </div>
            
            <div *ngIf="myItems.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No items listed</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by listing your first item.</p>
              <div class="mt-6">
                <button 
                  (click)="navigateToAddItem()"
                  class="btn-primary">
                  List an Item
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Swap Requests -->
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Swap Requests</h2>
          
          <div class="space-y-4">
            <div 
              *ngFor="let swap of swapRequests" 
              class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ swap.requesterName }}</p>
                  <p class="text-sm text-gray-600">Requested your item</p>
                  <p class="text-xs text-gray-500">{{ swap.createdAt | date:'short' }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    [class]="getSwapStatusClass(swap.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ swap.status }}
                  </span>
                  <button 
                    *ngIf="swap.status === 'pending'"
                    (click)="respondToSwap(swap.id, 'accepted')"
                    class="text-green-600 hover:text-green-700 text-sm font-medium">
                    Accept
                  </button>
                  <button 
                    *ngIf="swap.status === 'pending'"
                    (click)="respondToSwap(swap.id, 'rejected')"
                    class="text-red-600 hover:text-red-700 text-sm font-medium">
                    Decline
                  </button>
                </div>
              </div>
            </div>
            
            <div *ngIf="swapRequests.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No swap requests</h3>
              <p class="mt-1 text-sm text-gray-500">When someone requests your items, they'll appear here.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card mt-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div class="space-y-4">
          <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Earned 25 points</p>
              <p class="text-xs text-gray-500">For completing a swap</p>
            </div>
            <span class="text-xs text-gray-400 ml-auto">2 hours ago</span>
          </div>
          
          <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">Swap completed</p>
              <p class="text-xs text-gray-500">Vintage Denim Jacket</p>
            </div>
            <span class="text-xs text-gray-400 ml-auto">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  myItems: Item[] = [];
  swapRequests: SwapRequest[] = [];
  pendingSwaps: SwapRequest[] = [];
  completedSwaps: SwapRequest[] = [];

  constructor(
    private authService: AuthService,
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadItems();
    this.loadSwapRequests();
  }

  loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  loadItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.myItems = items.filter(item => item.userId === this.currentUser?.id);
    });
  }

  loadSwapRequests(): void {
    this.itemService.getSwapRequests().subscribe(requests => {
      this.swapRequests = requests.filter(req => 
        this.myItems.some(item => item.id === req.itemId)
      );
      this.pendingSwaps = this.swapRequests.filter(req => req.status === 'pending');
      this.completedSwaps = this.swapRequests.filter(req => req.status === 'completed');
    });
  }

  getStatusClass(isAvailable: boolean, isApproved: boolean): string {
    if (!isApproved) return 'bg-yellow-100 text-yellow-800';
    if (!isAvailable) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  }

  getStatusText(isAvailable: boolean, isApproved: boolean): string {
    if (!isApproved) return 'Pending';
    if (!isAvailable) return 'Unavailable';
    return 'Available';
  }

  getSwapStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  respondToSwap(swapId: string, status: 'accepted' | 'rejected'): void {
    this.itemService.updateSwapRequest(swapId, status).subscribe(updatedSwap => {
      if (updatedSwap) {
        this.loadSwapRequests();
      }
    });
  }

  navigateToAddItem(): void {
    this.router.navigate(['/add-item']);
  }

  navigateToItem(itemId: string): void {
    this.router.navigate(['/item', itemId]);
  }
} 