export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  tags: string[];
  images: string[];
  pointsValue: number;
  userId: string;
  userName: string;
  userProfileImage?: string;
  isAvailable: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwapRequest {
  id: string;
  itemId: string;
  requesterId: string;
  requesterName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
} 