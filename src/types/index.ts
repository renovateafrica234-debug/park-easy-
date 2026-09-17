export type UserRole = 'driver' | 'attendant' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  role: UserRole;
  created_at: string;
}

export type BayStatus = 'open' | 'occupied' | 'reserved';

export interface Bay {
  id: string;
  lot_id: string;
  label: string; // e.g. "A1", "A2"
  status: BayStatus;
  current_booking_id?: string;
  vehicle_plate?: string;
  driver_name?: string;
  reserved_until?: string;
}

export interface ParkingLot {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  district: string; // 'Wuse 2' | 'Central Business District' | 'Maitama' | 'Garki 2' | 'Jabi' | 'Utako'
  lat: number;
  lng: number;
  price_per_hour: number;
  total_bays: number;
  open_bays: number;
  occupied_bays: number;
  reserved_bays: number;
  covered: boolean;
  security_guarded: boolean;
  operating_hours: string;
  distance_km?: number;
  created_at: string;
}

export type BookingStatus = 'pending' | 'paid' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  booking_code: string;
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  vehicle_plate: string;
  bay_id: string;
  bay_label: string;
  lot_id: string;
  lot_name: string;
  lot_address: string;
  lat: number;
  lng: number;
  duration_hours: number;
  amount: number;
  platform_fee: number; // 12% platform commission
  attendant_payout: number; // 88%
  status: BookingStatus;
  paystack_ref: string;
  payment_method: 'card' | 'bank_transfer' | 'ussd';
  started_at: string;
  ends_at: string;
  created_at: string;
}

export interface PlatformStats {
  totalLots: number;
  totalBays: number;
  openBays: number;
  occupiedBays: number;
  occupancyRate: number;
  grossVolume: number;
  platformCommissionEarned: number;
  totalNetPayouts: number;
  activeBookingsCount: number;
}
