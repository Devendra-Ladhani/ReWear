import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Item, SwapRequest } from '../models/item.model';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  private swapRequestsSubject = new BehaviorSubject<SwapRequest[]>([]);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const mockItems: Item[] = [
      {
        id: '1',
        title: 'Vintage Denim Jacket',
        description: 'Classic blue denim jacket in excellent condition. Perfect for layering.',
        category: 'Outerwear',
        type: 'Jacket',
        size: 'M',
        condition: 'excellent',
        tags: ['vintage', 'denim', 'casual'],
        images: [
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop',
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop'
        ],
        pointsValue: 50,
        userId: '2',
        userName: 'Sarah Johnson',
        userProfileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        isAvailable: true,
        isApproved: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        title: 'Summer Floral Dress',
        description: 'Beautiful floral print dress perfect for summer events.',
        category: 'Dresses',
        type: 'Casual Dress',
        size: 'S',
        condition: 'good',
        tags: ['floral', 'summer', 'casual'],
        images: [
          'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop'
        ],
        pointsValue: 35,
        userId: '3',
        userName: 'Emma Wilson',
        userProfileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        isAvailable: true,
        isApproved: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '3',
        title: 'Leather Crossbody Bag',
        description: 'High-quality leather crossbody bag with adjustable strap.',
        category: 'Accessories',
        type: 'Bag',
        size: 'One Size',
        condition: 'excellent',
        tags: ['leather', 'crossbody', 'accessory'],
        images: [
          'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop'
        ],
        pointsValue: 40,
        userId: '4',
        userName: 'Michael Brown',
        userProfileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isAvailable: true,
        isApproved: true,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      }
    ];

    this.itemsSubject.next(mockItems);
  }

  getItems(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  getItemById(id: string): Observable<Item | undefined> {
    const items = this.itemsSubject.value;
    const item = items.find(item => item.id === id);
    return of(item);
  }

  addItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'isApproved'>): Observable<Item> {
    const newItem: Item = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isApproved: false
    };

    const currentItems = this.itemsSubject.value;
    this.itemsSubject.next([...currentItems, newItem]);
    return of(newItem);
  }

  updateItem(id: string, updates: Partial<Item>): Observable<Item | undefined> {
    const currentItems = this.itemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
      const updatedItem = { ...currentItems[itemIndex], ...updates, updatedAt: new Date() };
      currentItems[itemIndex] = updatedItem;
      this.itemsSubject.next([...currentItems]);
      return of(updatedItem);
    }
    
    return of(undefined);
  }

  deleteItem(id: string): Observable<boolean> {
    const currentItems = this.itemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    this.itemsSubject.next(filteredItems);
    return of(true);
  }

  approveItem(id: string): Observable<boolean> {
    return this.updateItem(id, { isApproved: true }).pipe(
      map(item => !!item)
    );
  }

  requestSwap(itemId: string, requesterId: string, requesterName: string): Observable<SwapRequest> {
    const newRequest: SwapRequest = {
      id: Date.now().toString(),
      itemId,
      requesterId,
      requesterName,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentRequests = this.swapRequestsSubject.value;
    this.swapRequestsSubject.next([...currentRequests, newRequest]);
    return of(newRequest);
  }

  getSwapRequests(): Observable<SwapRequest[]> {
    return this.swapRequestsSubject.asObservable();
  }

  updateSwapRequest(id: string, status: SwapRequest['status']): Observable<SwapRequest | undefined> {
    const currentRequests = this.swapRequestsSubject.value;
    const requestIndex = currentRequests.findIndex(req => req.id === id);
    
    if (requestIndex !== -1) {
      const updatedRequest = { 
        ...currentRequests[requestIndex], 
        status, 
        updatedAt: new Date() 
      };
      currentRequests[requestIndex] = updatedRequest;
      this.swapRequestsSubject.next([...currentRequests]);
      return of(updatedRequest);
    }
    
    return of(undefined);
  }

  redeemWithPoints(itemId: string, userId: string): Observable<boolean> {
    const items = this.itemsSubject.value;
    const item = items.find(item => item.id === itemId);
    
    if (item && item.isAvailable) {
      // In a real app, you'd check if user has enough points
      this.updateItem(itemId, { isAvailable: false });
      return of(true);
    }
    
    return of(false);
  }
} 