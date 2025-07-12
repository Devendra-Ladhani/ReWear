import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../models/item.model';
import { SwapRequest } from '../../models/item.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage items and monitor platform activity</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Approval</p>
              <p class="text-2xl font-bold text-gray-900">{{ pendingItems.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Approved Items</p>
              <p class="text-2xl font-bold text-gray-900">{{ approvedItems.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Swaps</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeSwaps.length }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalUsers }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-8">
          <button 
            (click)="setActiveTab('pending')"
            [class]="activeTab === 'pending' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="border-b-2 py-2 px-1 text-sm font-medium">
            Pending Approval
          </button>
          <button 
            (click)="setActiveTab('approved')"
            [class]="activeTab === 'approved' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="border-b-2 py-2 px-1 text-sm font-medium">
            Approved Items
          </button>
          <button 
            (click)="setActiveTab('swaps')"
            [class]="activeTab === 'swaps' ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            class="border-b-2 py-2 px-1 text-sm font-medium">
            Swap Requests
          </button>
        </nav>
      </div>

      <!-- Pending Items Tab -->
      <div *ngIf="activeTab === 'pending'" class="space-y-6">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Items Pending Approval</h2>
          
          <div class="space-y-4">
            <div 
              *ngFor="let item of pendingItems" 
              class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-start space-x-4">
                <img 
                  [src]="item.images[0]" 
                  [alt]="item.title"
                  class="w-20 h-20 object-cover rounded-lg">
                
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="font-medium text-gray-900">{{ item.title }}</h3>
                    <div class="flex items-center space-x-2">
                      <span class="bg-primary-600 text-white px-2 py-1 rounded-full text-sm">
                        {{ item.pointsValue }} pts
                      </span>
                      <span 
                        [class]="getConditionClass(item.condition)"
                        class="px-2 py-1 rounded-full text-xs font-medium">
                        {{ item.condition }}
                      </span>
                    </div>
                  </div>
                  
                  <p class="text-sm text-gray-600 mb-2">{{ item.description }}</p>
                  
                  <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center space-x-4">
                      <span>{{ item.category }} • {{ item.type }}</span>
                      <span>Size: {{ item.size }}</span>
                      <div class="flex items-center space-x-2">
                        <img 
                          [src]="item.userProfileImage" 
                          [alt]="item.userName"
                          class="w-5 h-5 rounded-full">
                        <span>{{ item.userName }}</span>
                      </div>
                    </div>
                    <span>{{ item.createdAt | date:'short' }}</span>
                  </div>
                </div>
                
                <div class="flex flex-col space-y-2">
                  <button 
                    (click)="approveItem(item.id)"
                    class="btn-primary text-sm">
                    Approve
                  </button>
                  <button 
                    (click)="rejectItem(item.id)"
                    class="btn-outline text-sm text-red-600 border-red-300 hover:bg-red-50">
                    Reject
                  </button>
                </div>
              </div>
            </div>
            
            <div *ngIf="pendingItems.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No items pending approval</h3>
              <p class="mt-1 text-sm text-gray-500">All items have been reviewed.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Approved Items Tab -->
      <div *ngIf="activeTab === 'approved'" class="space-y-6">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Approved Items</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let item of approvedItems">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img 
                        [src]="item.images[0]" 
                        [alt]="item.title"
                        class="w-10 h-10 object-cover rounded-lg">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ item.title }}</div>
                        <div class="text-sm text-gray-500">{{ item.type }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img 
                        [src]="item.userProfileImage" 
                        [alt]="item.userName"
                        class="w-6 h-6 rounded-full">
                      <span class="ml-2 text-sm text-gray-900">{{ item.userName }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.pointsValue }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      [class]="item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ item.isAvailable ? 'Available' : 'Unavailable' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      (click)="removeItem(item.id)"
                      class="text-red-600 hover:text-red-900">
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Swap Requests Tab -->
      <div *ngIf="activeTab === 'swaps'" class="space-y-6">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Swap Requests</h2>
          
          <div class="space-y-4">
            <div 
              *ngFor="let swap of swapRequests" 
              class="border border-gray-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="font-medium text-gray-900">{{ swap.requesterName }}</p>
                  <p class="text-sm text-gray-600">Requested a swap</p>
                  <p class="text-xs text-gray-500">{{ swap.createdAt | date:'short' }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span 
                    [class]="getSwapStatusClass(swap.status)"
                    class="px-2 py-1 rounded-full text-xs font-medium">
                    {{ swap.status }}
                  </span>
                </div>
              </div>
            </div>
            
            <div *ngIf="swapRequests.length === 0" class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">No swap requests</h3>
              <p class="mt-1 text-sm text-gray-500">No pending swap requests at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeTab: 'pending' | 'approved' | 'swaps' = 'pending';
  allItems: Item[] = [];
  pendingItems: Item[] = [];
  approvedItems: Item[] = [];
  swapRequests: SwapRequest[] = [];
  activeSwaps: SwapRequest[] = [];
  totalUsers: number = 0;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.itemService.getItems().subscribe(items => {
      this.allItems = items;
      this.pendingItems = items.filter(item => !item.isApproved);
      this.approvedItems = items.filter(item => item.isApproved);
    });

    this.itemService.getSwapRequests().subscribe(requests => {
      this.swapRequests = requests;
      this.activeSwaps = requests.filter(req => req.status === 'pending' || req.status === 'accepted');
    });

    // Mock total users count
    this.totalUsers = 567;
  }

  setActiveTab(tab: 'pending' | 'approved' | 'swaps'): void {
    this.activeTab = tab;
  }

  approveItem(itemId: string): void {
    this.itemService.approveItem(itemId).subscribe(success => {
      if (success) {
        this.loadData();
        alert('Item approved successfully!');
      }
    });
  }

  rejectItem(itemId: string): void {
    if (confirm('Are you sure you want to reject this item?')) {
      this.itemService.deleteItem(itemId).subscribe(success => {
        if (success) {
          this.loadData();
          alert('Item rejected and removed.');
        }
      });
    }
  }

  removeItem(itemId: string): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.itemService.deleteItem(itemId).subscribe(success => {
        if (success) {
          this.loadData();
          alert('Item removed successfully.');
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

  getSwapStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
} 