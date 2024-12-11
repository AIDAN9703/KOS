export interface Review {
  id: number;
  userId: number;
  boatId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    profileImage?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
} 