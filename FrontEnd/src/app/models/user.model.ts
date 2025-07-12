export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  isAdmin: boolean;
  createdAt: Date;
  profileImage?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 