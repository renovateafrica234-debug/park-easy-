import { ParkingLot, Bay, Booking, UserProfile, PlatformStats, BayStatus } from '../types';
import { INITIAL_LOTS, generateInitialBays, INITIAL_BOOKINGS, DEFAULT_PROFILES, PLATFORM_COMMISSION_RATE } from '../data/mockData';

const STORAGE_KEYS = {
  LOTS: 'parkeasy_lots_v1',
  BAYS: 'parkeasy_bays_v1',
  BOOKINGS: 'parkeasy_bookings_v1',
  CURRENT_USER: 'parkeasy_current_user_v1',
};

type Listener = () => void;

class ParkingStore {
  private lots: ParkingLot[] = [];
  private bays: Bay[] = [];
  private bookings: Booking[] = [];
  private currentUser: UserProfile = DEFAULT_PROFILES[0]; // Driver by default
  private listeners: Set<Listener> = new Set();
  private userLocation: { lat: number; lng: number } = { lat: 9.0765, lng: 7.3986 }; // Abuja center default

  constructor() {
    this.init();
  }

  private init() {
    try {
      const savedLots = localStorage.getItem(STORAGE_KEYS.LOTS);
      const savedBays = localStorage.getItem(STORAGE_KEYS.BAYS);
      const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      if (savedLots && savedBays) {
        this.lots = JSON.parse(savedLots);
        this.bays = JSON.parse(savedBays);
      } else {
        this.lots = INITIAL_LOTS;
        this.bays = generateInitialBays();
        this.persistLotsAndBays();
      }

      if (savedBookings) {
        this.bookings = JSON.parse(savedBookings);
      } else {
        this.bookings = INITIAL_BOOKINGS;
        this.persistBookings();
      }

      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      } else {
        this.currentUser = DEFAULT_PROFILES[0];
      }
    } catch {
      this.lots = INITIAL_LOTS;
      this.bays = generateInitialBays();
      this.bookings = INITIAL_BOOKINGS;
      this.currentUser = DEFAULT_PROFILES[0];
    }

    this.recalculateLotBayCounts();
  }

  private persistLotsAndBays() {
    try {
      localStorage.setItem(STORAGE_KEYS.LOTS, JSON.stringify(this.lots));
      localStorage.setItem(STORAGE_KEYS.BAYS, JSON.stringify(this.bays));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  private persistBookings() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(this.bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public recalculateLotBayCounts() {
    this.lots = this.lots.map((lot) => {
      const lotBays = this.bays.filter((b) => b.lot_id === lot.id);
      const openCount = lotBays.filter((b) => b.status === 'open').length;
      const occupiedCount = lotBays.filter((b) => b.status === 'occupied').length;
      const reservedCount = lotBays.filter((b) => b.status === 'reserved').length;

      // calculate distance from userLocation
      const distance = this.calculateDistance(
        this.userLocation.lat,
        this.userLocation.lng,
        lot.lat,
        lot.lng
      );

      return {
        ...lot,
        total_bays: lotBays.length,
        open_bays: openCount,
        occupied_bays: occupiedCount,
        reserved_bays: reservedCount,
        distance_km: Math.round(distance * 10) / 10,
      };
    });
  }

  // Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // GETTERS
  public getLots(): ParkingLot[] {
    return this.lots;
  }

  public getLotById(id: string): ParkingLot | undefined {
    return this.lots.find((l) => l.id === id);
  }

  public getBays(lotId?: string): Bay[] {
    if (lotId) {
      return this.bays.filter((b) => b.lot_id === lotId);
    }
    return this.bays;
  }

  public getBookings(driverId?: string): Booking[] {
    if (driverId) {
      return this.bookings.filter((b) => b.driver_id === driverId);
    }
    return this.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id || b.booking_code === id);
  }

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
  }

  public setUserLocation(lat: number, lng: number) {
    this.userLocation = { lat, lng };
    this.recalculateLotBayCounts();
    this.notify();
  }

  public getUserLocation() {
    return this.userLocation;
  }

  // MUTATIONS (Simulating Supabase Realtime updates)
  public toggleBayStatus(bayId: string): Bay | null {
    const bayIndex = this.bays.findIndex((b) => b.id === bayId);
    if (bayIndex === -1) return null;

    const bay = this.bays[bayIndex];
    let nextStatus: BayStatus = 'open';

    if (bay.status === 'open') {
      nextStatus = 'occupied';
    } else if (bay.status === 'occupied') {
      nextStatus = 'open';
    } else {
      // reserved -> occupied or open
      nextStatus = 'occupied';
    }

    const updatedBay: Bay = {
      ...bay,
      status: nextStatus,
      vehicle_plate: nextStatus === 'open' ? undefined : bay.vehicle_plate || 'ABJ-ATT-AUTO',
    };

    this.bays[bayIndex] = updatedBay;
    this.recalculateLotBayCounts();
    this.persistLotsAndBays();
    this.notify();
    return updatedBay;
  }

  public setBayStatus(bayId: string, status: BayStatus, vehiclePlate?: string, driverName?: string): Bay | null {
    const bayIndex = this.bays.findIndex((b) => b.id === bayId);
    if (bayIndex === -1) return null;

    const updatedBay: Bay = {
      ...this.bays[bayIndex],
      status,
      vehicle_plate: vehiclePlate,
      driver_name: driverName,
    };

    this.bays[bayIndex] = updatedBay;
    this.recalculateLotBayCounts();
    this.persistLotsAndBays();
    this.notify();
    return updatedBay;
  }

  // CREATE BOOKING (Driver flow with 12% platform fee calculation)
  public createBooking(params: {
    lotId: string;
    bayId?: string;
    driverName: string;
    driverPhone: string;
    vehiclePlate: string;
    durationHours: number;
    paymentMethod?: 'card' | 'bank_transfer' | 'ussd';
    paystackRef?: string;
  }): Booking {
    const lot = this.getLotById(params.lotId);
    if (!lot) throw new Error('Parking lot not found');

    // Find requested bay or first open bay
    let targetBay: Bay | undefined;
    if (params.bayId) {
      targetBay = this.bays.find((b) => b.id === params.bayId);
    }
    if (!targetBay || targetBay.status !== 'open') {
      targetBay = this.bays.find((b) => b.lot_id === params.lotId && b.status === 'open');
    }

    if (!targetBay) {
      throw new Error('No open bays currently available in this lot');
    }

    const duration = params.durationHours;
    const amount = lot.price_per_hour * duration;
    const platformFee = Math.round(amount * PLATFORM_COMMISSION_RATE);
    const attendantPayout = amount - platformFee;

    const bookingCode = `PEA-ABJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const endsAt = new Date(now.getTime() + duration * 60 * 60 * 1000);

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      booking_code: bookingCode,
      driver_id: this.currentUser.id,
      driver_name: params.driverName || this.currentUser.full_name,
      driver_phone: params.driverPhone || this.currentUser.phone,
      vehicle_plate: params.vehiclePlate.toUpperCase(),
      bay_id: targetBay.id,
      bay_label: targetBay.label,
      lot_id: lot.id,
      lot_name: lot.name,
      lot_address: lot.address,
      lat: lot.lat,
      lng: lot.lng,
      duration_hours: duration,
      amount,
      platform_fee: platformFee,
      attendant_payout: attendantPayout,
      status: 'active', // paid & active
      paystack_ref: params.paystackRef || `T${Date.now()}`,
      payment_method: params.paymentMethod || 'card',
      started_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      created_at: now.toISOString(),
    };

    // Update bay to reserved with driver details
    this.setBayStatus(targetBay.id, 'reserved', params.vehiclePlate.toUpperCase(), newBooking.driver_name);

    this.bookings.unshift(newBooking);
    this.persistBookings();
    this.notify();

    return newBooking;
  }

  // Complete / Check in booking
  public completeBooking(bookingId: string) {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    booking.status = 'completed';
    // Free the bay
    this.setBayStatus(booking.bay_id, 'open');
    this.persistBookings();
    this.notify();
  }

  // Extend booking
  public extendBooking(bookingId: string, additionalHours: number = 1): Booking | null {
    const booking = this.bookings.find((b) => b.id === bookingId);
    if (!booking) return null;

    const lot = this.getLotById(booking.lot_id);
    const addedAmount = (lot?.price_per_hour || 400) * additionalHours;
    const addedFee = Math.round(addedAmount * PLATFORM_COMMISSION_RATE);

    booking.duration_hours += additionalHours;
    booking.amount += addedAmount;
    booking.platform_fee += addedFee;
    booking.attendant_payout += addedAmount - addedFee;

    const currentEnd = new Date(booking.ends_at);
    currentEnd.setTime(currentEnd.getTime() + additionalHours * 3600000);
    booking.ends_at = currentEnd.toISOString();

    this.persistBookings();
    this.notify();
    return booking;
  }

  // ADMIN STATS
  public getPlatformStats(): PlatformStats {
    const totalLots = this.lots.length;
    const totalBays = this.bays.length;
    const openBays = this.bays.filter((b) => b.status === 'open').length;
    const occupiedBays = this.bays.filter((b) => b.status === 'occupied').length;
    const reservedBays = this.bays.filter((b) => b.status === 'reserved').length;
    const occupancyRate = totalBays > 0 ? Math.round(((occupiedBays + reservedBays) / totalBays) * 100) : 0;

    const grossVolume = this.bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.amount : 0), 0);
    const platformCommissionEarned = this.bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? b.platform_fee : 0), 0);
    const totalNetPayouts = grossVolume - platformCommissionEarned;
    const activeBookingsCount = this.bookings.filter((b) => b.status === 'active').length;

    return {
      totalLots,
      totalBays,
      openBays,
      occupiedBays,
      occupancyRate,
      grossVolume,
      platformCommissionEarned,
      totalNetPayouts,
      activeBookingsCount,
    };
  }

  // Add a new lot (Admin capability)
  public addLot(lotData: Omit<ParkingLot, 'id' | 'created_at' | 'open_bays' | 'occupied_bays' | 'reserved_bays'>) {
    const newLotId = `lot-${Date.now()}`;
    const newLot: ParkingLot = {
      ...lotData,
      id: newLotId,
      open_bays: lotData.total_bays,
      occupied_bays: 0,
      reserved_bays: 0,
      created_at: new Date().toISOString(),
    };

    // create initial bays for this lot
    const newBays: Bay[] = [];
    for (let i = 1; i <= lotData.total_bays; i++) {
      const section = i <= Math.ceil(lotData.total_bays / 2) ? 'A' : 'B';
      const num = i <= Math.ceil(lotData.total_bays / 2) ? i : i - Math.ceil(lotData.total_bays / 2);
      newBays.push({
        id: `bay-${newLotId}-${section}${num}`,
        lot_id: newLotId,
        label: `${section}${num}`,
        status: 'open',
      });
    }

    this.lots.push(newLot);
    this.bays.push(...newBays);
    this.recalculateLotBayCounts();
    this.persistLotsAndBays();
    this.notify();
    return newLot;
  }

  // Reset store to defaults
  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.LOTS);
    localStorage.removeItem(STORAGE_KEYS.BAYS);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    this.lots = INITIAL_LOTS;
    this.bays = generateInitialBays();
    this.bookings = INITIAL_BOOKINGS;
    this.recalculateLotBayCounts();
    this.persistLotsAndBays();
    this.persistBookings();
    this.notify();
  }
}

export const parkingStore = new ParkingStore();
