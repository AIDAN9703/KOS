export interface Boat {
  id: number;
  name: string;
  description: string;
  length: string;
  capacity: number;
  basePrice: number;
  location: string;
  images: string[];
  amenities: string[];
  features: Array<{
    id: number;
    name: string;
    category: string;
    icon: string;
  }>;
}
