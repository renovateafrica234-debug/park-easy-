import { ParkingLot, Bay, Booking, UserProfile } from '../types';

export const PLATFORM_COMMISSION_RATE = 0.12; // 12% commission as specified

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'user-driver-1',
    full_name: 'Emeka Okonkwo',
    phone: '+234 803 123 4567',
    email: 'emeka.driver@parkeasy.ng',
    role: 'driver',
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'user-attendant-1',
    full_name: 'Ibrahim Bello (Attendant)',
    phone: '+234 809 987 6543',
    email: 'ibrahim.wuse2@parkeasy.ng',
    role: 'attendant',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'user-attendant-2',
    full_name: 'Yakubu Danjuma',
    phone: '+234 814 555 7788',
    email: 'yakubu.cbd@parkeasy.ng',
    role: 'attendant',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'user-admin-1',
    full_name: 'ParkEasy Admin (Renovate Africa)',
    phone: '+234 802 000 1122',
    email: 'admin@parkeasy.ng',
    role: 'admin',
    created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export const INITIAL_LOTS: ParkingLot[] = [
  {
    id: 'lot-wuse2-plaza',
    owner_id: 'user-attendant-1',
    name: 'Aminu Kano Crescent Strip',
    address: 'Plot 142 Aminu Kano Crescent, Wuse 2, Abuja',
    district: 'Wuse 2',
    lat: 9.0818,
    lng: 7.4812,
    price_per_hour: 500,
    total_bays: 16,
    open_bays: 6,
    occupied_bays: 9,
    reserved_bays: 1,
    covered: true,
    security_guarded: true,
    operating_hours: '07:00 AM - 11:00 PM',
    created_at: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    id: 'lot-cbd-towers',
    owner_id: 'user-attendant-2',
    name: 'Central Business District Hub',
    address: 'Herbert Macaulay Way (Opposite NNPC Towers), CBD, Abuja',
    district: 'Central Business District',
    lat: 9.0552,
    lng: 7.4941,
    price_per_hour: 600,
    total_bays: 20,
    open_bays: 8,
    occupied_bays: 11,
    reserved_bays: 1,
    covered: false,
    security_guarded: true,
    operating_hours: '24 Hours Open',
    created_at: new Date(Date.now() - 86400000 * 40).toISOString(),
  },
  {
    id: 'lot-maitama-hilton',
    owner_id: 'user-attendant-1',
    name: 'Maitama Park & Go (Near Transcorp)',
    address: '1 Aguiyi Ironsi St, Maitama, Abuja',
    district: 'Maitama',
    lat: 9.0834,
    lng: 7.4965,
    price_per_hour: 800,
    total_bays: 14,
    open_bays: 3,
    occupied_bays: 10,
    reserved_bays: 1,
    covered: true,
    security_guarded: true,
    operating_hours: '06:00 AM - 12:00 AM',
    created_at: new Date(Date.now() - 86400000 * 35).toISOString(),
  },
  {
    id: 'lot-jabi-lake',
    owner_id: 'user-attendant-1',
    name: 'Jabi Lake Mall Parking Deck',
    address: 'Bala Sokoto Way, Jabi Lake, Abuja',
    district: 'Jabi',
    lat: 9.0782,
    lng: 7.4241,
    price_per_hour: 300,
    total_bays: 24,
    open_bays: 14,
    occupied_bays: 9,
    reserved_bays: 1,
    covered: true,
    security_guarded: true,
    operating_hours: '08:00 AM - 11:00 PM',
    created_at: new Date(Date.now() - 86400000 * 25).toISOString(),
  },
  {
    id: 'lot-banex-wuse2',
    owner_id: 'user-attendant-2',
    name: 'Banex Plaza Commercial Bay',
    address: 'Plot 750 Aminu Kano Way, Wuse 2, Abuja',
    district: 'Wuse 2',
    lat: 9.0864,
    lng: 7.4725,
    price_per_hour: 500,
    total_bays: 12,
    open_bays: 0,
    occupied_bays: 12,
    reserved_bays: 0,
    covered: false,
    security_guarded: true,
    operating_hours: '08:00 AM - 08:00 PM',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'lot-garki2-mall',
    owner_id: 'user-attendant-2',
    name: 'Garki Area 11 Commercial Deck',
    address: 'Moshood Abiola Way, Area 11, Garki, Abuja',
    district: 'Garki',
    lat: 9.0348,
    lng: 7.4912,
    price_per_hour: 400,
    total_bays: 18,
    open_bays: 10,
    occupied_bays: 7,
    reserved_bays: 1,
    covered: false,
    security_guarded: true,
    operating_hours: '07:30 AM - 09:30 PM',
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'lot-fed-secretariat',
    owner_id: 'user-attendant-1',
    name: 'Federal Secretariat Complex Lot C',
    address: 'Shehu Shagari Way, Central Area, Abuja',
    district: 'Central Business District',
    lat: 9.0621,
    lng: 7.5028,
    price_per_hour: 300,
    total_bays: 25,
    open_bays: 16,
    occupied_bays: 9,
    reserved_bays: 0,
    covered: true,
    security_guarded: true,
    operating_hours: '06:30 AM - 07:00 PM',
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'lot-utako-transit',
    owner_id: 'user-attendant-2',
    name: 'Utako Transit Interchange Lot',
    address: 'Plot 12 Obafemi Awolowo Way, Utako, Abuja',
    district: 'Utako',
    lat: 9.0665,
    lng: 7.4421,
    price_per_hour: 300,
    total_bays: 15,
    open_bays: 5,
    occupied_bays: 10,
    reserved_bays: 0,
    covered: false,
    security_guarded: true,
    operating_hours: '24 Hours Open',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

// Generate bay list for lots
export function generateInitialBays(): Bay[] {
  const allBays: Bay[] = [];

  INITIAL_LOTS.forEach((lot) => {
    const total = lot.total_bays;
    const reservedCount = lot.reserved_bays;
    const occupiedCount = lot.occupied_bays;

    for (let i = 1; i <= total; i++) {
      const section = i <= Math.ceil(total / 2) ? 'A' : 'B';
      const num = i <= Math.ceil(total / 2) ? i : i - Math.ceil(total / 2);
      const label = `${section}${num}`;

      let status: 'open' | 'occupied' | 'reserved' = 'open';
      let vehicle_plate: string | undefined = undefined;
      let driver_name: string | undefined = undefined;

      if (i <= reservedCount) {
        status = 'reserved';
        vehicle_plate = 'ABJ-772-KJ';
        driver_name = 'Emeka Okonkwo';
      } else if (i <= reservedCount + occupiedCount) {
        status = 'occupied';
        vehicle_plate = `RSH-${100 + i * 14}-AB`;
      }

      allBays.push({
        id: `bay-${lot.id}-${label}`,
        lot_id: lot.id,
        label,
        status,
        vehicle_plate,
        driver_name,
      });
    }
  });

  return allBays;
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1001',
    booking_code: 'PEA-ABJ-8192',
    driver_id: 'user-driver-1',
    driver_name: 'Emeka Okonkwo',
    driver_phone: '+234 803 123 4567',
    vehicle_plate: 'ABJ-772-KJ',
    bay_id: 'bay-lot-wuse2-plaza-A1',
    bay_label: 'A1',
    lot_id: 'lot-wuse2-plaza',
    lot_name: 'Wuse 2 Central Plaza Lot',
    lot_address: 'Plot 142 Aminu Kano Crescent, Wuse 2, Abuja',
    lat: 9.0818,
    lng: 7.4812,
    duration_hours: 2,
    amount: 800,
    platform_fee: 96,
    attendant_payout: 704,
    status: 'active',
    paystack_ref: 'T492810928374',
    payment_method: 'card',
    started_at: new Date(Date.now() - 25 * 60000).toISOString(),
    ends_at: new Date(Date.now() + 95 * 60000).toISOString(),
    created_at: new Date(Date.now() - 26 * 60000).toISOString(),
  },
  {
    id: 'book-1002',
    booking_code: 'PEA-ABJ-6641',
    driver_id: 'user-driver-2',
    driver_name: 'Zainab Mohammed',
    driver_phone: '+234 802 443 8901',
    vehicle_plate: 'KJA-194-XC',
    bay_id: 'bay-lot-cbd-towers-A1',
    bay_label: 'A1',
    lot_id: 'lot-cbd-towers',
    lot_name: 'Central Business District Hub',
    lot_address: 'Herbert Macaulay Way, CBD, Abuja',
    lat: 9.0552,
    lng: 7.4941,
    duration_hours: 4,
    amount: 2000,
    platform_fee: 240,
    attendant_payout: 1760,
    status: 'active',
    paystack_ref: 'T773918239014',
    payment_method: 'card',
    started_at: new Date(Date.now() - 60 * 60000).toISOString(),
    ends_at: new Date(Date.now() + 180 * 60000).toISOString(),
    created_at: new Date(Date.now() - 62 * 60000).toISOString(),
  },
  {
    id: 'book-1003',
    booking_code: 'PEA-ABJ-3392',
    driver_id: 'user-driver-3',
    driver_name: 'Femi Alabi',
    driver_phone: '+234 818 902 3344',
    vehicle_plate: 'ABC-582-LK',
    bay_id: 'bay-lot-maitama-hilton-A1',
    bay_label: 'A1',
    lot_id: 'lot-maitama-hilton',
    lot_name: 'Maitama Park & Go (Near Transcorp)',
    lot_address: '1 Aguiyi Ironsi St, Maitama, Abuja',
    lat: 9.0834,
    lng: 7.4965,
    duration_hours: 1,
    amount: 600,
    platform_fee: 72,
    attendant_payout: 528,
    status: 'completed',
    paystack_ref: 'T330198421092',
    payment_method: 'bank_transfer',
    started_at: new Date(Date.now() - 150 * 60000).toISOString(),
    ends_at: new Date(Date.now() - 90 * 60000).toISOString(),
    created_at: new Date(Date.now() - 152 * 60000).toISOString(),
  },
  {
    id: 'book-1004',
    booking_code: 'PEA-ABJ-9043',
    driver_id: 'user-driver-4',
    driver_name: 'Chioma Adebayo',
    driver_phone: '+234 701 445 9911',
    vehicle_plate: 'GWA-831-ZZ',
    bay_id: 'bay-lot-jabi-lake-A1',
    bay_label: 'A1',
    lot_id: 'lot-jabi-lake',
    lot_name: 'Jabi Lake Mall Parking Wing B',
    lot_address: 'Bala Sokoto Way, Jabi District, Abuja',
    lat: 9.0782,
    lng: 7.4241,
    duration_hours: 3,
    amount: 1200,
    platform_fee: 144,
    attendant_payout: 1056,
    status: 'completed',
    paystack_ref: 'T881023940192',
    payment_method: 'card',
    started_at: new Date(Date.now() - 240 * 60000).toISOString(),
    ends_at: new Date(Date.now() - 60 * 60000).toISOString(),
    created_at: new Date(Date.now() - 245 * 60000).toISOString(),
  }
];
