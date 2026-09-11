export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
}

export interface User {
  email: string;
  name: string;
  facebook: string;
  kontak: string;
  kotakab: string;
  imageUrl: string;
}

export interface Address {
  _id: string;
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  geolokasi: string;
  isDefault: boolean;
}

export interface Order {
  _id: string;
  user: string;
  clerkId: string;
  orderItems: OrderItem[];
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    phoneNumber: string;
  };
  paymentResult: {
    id: string;
    status: string;
  };
  totalPrice: number;
  status: "pending" | "shipped" | "delivered";
  hasReviewed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  _id: string;
  product: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  _id: string;
  productId: string;
  userId: string | User;
  orderId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  _id: string;
  clerkId: string;
  subTotal: number;
  items: CartItem[];
}

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
}

export interface FormToko {
  name: string;
  desc: string;
  kotakab: string;
  alamat: string;
  kodepos: string;
  kontak: string;
  geolokasi: string;
  imageUrl: string;
  waktu: string;
}

