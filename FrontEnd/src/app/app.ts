import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a routerLink="/" class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">R</span>
                </div>
                <span class="text-xl font-bold text-gray-900">ReWear</span>
              </a>
            </div>
            
            <div class="flex items-center space-x-4">
              <a routerLink="/browse" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Browse Items</a>
              <a routerLink="/add-item" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">List an Item</a>
              <a routerLink="/dashboard" class="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
              <span *ngIf="isshow">
              </span>
              <a routerLink="/login" class="btn-primary text-sm">Sign In</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <router-outlet></router-outlet>
      </main>
      
      <footer class="bg-gray-800 text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center">
            <p class="text-gray-300">&copy; 2024 ReWear. Promoting sustainable fashion through clothing exchange.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent implements OnInit{
  title = 'ReWear';
  isshow:boolean = true;
  currentUser:string = ""
  
  ngOnInit(): void {
    this.currentUser = localStorage.getItem('isShow')!;
    if(this.currentUser == 'true' || this.currentUser == "" || this.currentUser == undefined){
      this.isshow = true
    }else{
      this.isshow = false;
    }
  }
  
}
