import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ItemService } from '../../services/item.service';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sustainable Fashion
            <span class="text-primary-600">Reimagined</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the movement to reduce textile waste. Exchange your unused clothing through direct swaps or our point-based system. 
            Give your clothes a second life while building a sustainable community.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              (click)="navigateToBrowse()"
              class="btn-primary text-lg px-8 py-3">
              Start Swapping
            </button>
            <button 
              (click)="navigateToAddItem()"
              class="btn-outline text-lg px-8 py-3">
              List an Item
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">1,234</div>
            <div class="text-gray-600">Items Exchanged</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">567</div>
            <div class="text-gray-600">Active Users</div>
          </div>
          <div>
            <div class="text-4xl font-bold text-primary-600 mb-2">89</div>
            <div class="text-gray-600">Tons of Waste Saved</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Items Section -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Featured Items</h2>
          <p class="text-gray-600">Discover amazing pieces from our community</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            *ngFor="let item of featuredItems" 
            class="card hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            (click)="navigateToItem(item.id)">
            <div class="relative mb-4">
              <img 
                [src]="item.images[0]" 
                [alt]="item.title"
                class="w-full h-64 object-cover rounded-lg">
              <div class="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-sm">
                {{ item.pointsValue }} pts
              </div>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mb-3">{{ item.description.substring(0, 100) }}...</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <img 
                  [src]="item.userProfileImage" 
                  [alt]="item.userName"
                  class="w-6 h-6 rounded-full">
                <span class="text-sm text-gray-600">{{ item.userName }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ item.condition }}</span>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-12">
          <button 
            (click)="navigateToBrowse()"
            class="btn-primary">
            Browse All Items
          </button>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-gray-600">Get started in three simple steps</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">List Your Items</h3>
            <p class="text-gray-600">Upload photos and details of clothing you no longer wear</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Browse & Connect</h3>
            <p class="text-gray-600">Find items you love and connect with other users</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Swap or Redeem</h3>
            <p class="text-gray-600">Exchange items directly or use points to redeem</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">Ready to Start Your Sustainable Fashion Journey?</h2>
        <p class="text-primary-100 mb-8 text-lg">Join thousands of users making fashion more sustainable</p>
        <button 
          (click)="navigateToRegister()"
          class="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
          Get Started Today
        </button>
      </div>
    </section>
  `
})
export class LandingComponent implements OnInit {
  featuredItems: Item[] = [];

  constructor(
    private itemService: ItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFeaturedItems();
  }

  loadFeaturedItems(): void {
    this.itemService.getItems().subscribe(items => {
      this.featuredItems = items.filter(item => item.isApproved && item.isAvailable).slice(0, 6);
    });
  }

  navigateToBrowse(): void {
    this.router.navigate(['/browse']);
  }

  navigateToAddItem(): void {
    this.router.navigate(['/add-item']);
  }

  navigateToItem(itemId: string): void {
    this.router.navigate(['/item', itemId]);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
} 