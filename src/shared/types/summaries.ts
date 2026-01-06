import { CustomLocation, Rating } from '.';

export interface SellerSummary {
  id: string; // Seller id
  name: string; // Seller name
  avatar?: string; // Seller avatar url
  rating?: Rating; // Seller rating
  location?: CustomLocation;
}

export interface ProductSummary {
  id: string; // Product id
  name: string; // Product name
  image: string; // Product image url
  price: number; // Product price
}
