export interface User {
  id: number;
  name: string;
  email?: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN' | 'OWNER';
  createdAt?: string;
  profileImage?: string;
}

export interface CompleteProfileData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  address: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, refreshToken: string, userData: User) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  sendRegistrationVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyRegistrationCode: (phoneNumber: string, code: string) => Promise<{ tempToken: string }>;
  completeRegistration: (profileData: CompleteProfileData, tempToken: string) => Promise<User>;
  sendLoginVerificationCode: (phoneNumber: string) => Promise<void>;
  verifyLoginCode: (phoneNumber: string, code: string) => Promise<any>;
  refreshAccessToken: (refreshToken: string) => Promise<string>;
  isAdmin: boolean;
} 