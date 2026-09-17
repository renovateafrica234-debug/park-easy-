import React, { useEffect, useState } from 'react';
import { ParkingLot, Bay, Booking, UserProfile } from './types';
import { parkingStore } from './services/parkingStore';
import { Header } from './components/navigation/Header';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { LandingHero } from './components/driver/LandingHero';
import { DriverMapView } from './components/driver/DriverMapView';
import { DigitalTicketView } from './components/driver/DigitalTicketView';
import { MyPassesView } from './components/driver/MyPassesView';
import { AttendantDashboard } from './components/attendant/AttendantDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { ParkEasyIcon } from './components/brand/ParkEasyIcon';
import { ShieldCheck, Heart, Sparkles, Navigation } from 'lucide-react';

export default function App() {
  const [lots, setLots] = useState<ParkingLot[]>(parkingStore.getLots());
  const [bays, setBays] = useState<Bay[]>(parkingStore.getBays());
  const [bookings, setBookings] = useState<Booking[]>(parkingStore.getBookings());
  const [currentUser, setCurrentUser] = useState<UserProfile>(parkingStore.getCurrentUser());
  const [activeTab, setActiveTab] = useState<'find' | 'tickets' | 'attendant' | 'admin'>('find');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [userLocation, setUserLocation] = useState(parkingStore.getUserLocation());
  const [isLocating, setIsLocating] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(undefined);
  const [hasScrolledToMap, setHasScrolledToMap] = useState(false);

  // Subscribe to parking store for real-time bay & booking synchronization
  useEffect(() => {
    const unsubscribe = parkingStore.subscribe(() => {
      setLots([...parkingStore.getLots()]);
      setBays([...parkingStore.getBays()]);
      setBookings([...parkingStore.getBookings()]);
      setCurrentUser({ ...parkingStore.getCurrentUser() });
    });
    return () => unsubscribe();
  }, []);

  // Request browser geolocation with fallback to Abuja Central
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      // fallback to Abuja Central
      parkingStore.setUserLocation(9.0765, 7.4812);
      setUserLocation({ lat: 9.0765, lng: 7.4812 });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        parkingStore.setUserLocation(coords.lat, coords.lng);
        setUserLocation(coords);
        setIsLocating(false);
      },
      (error) => {
        console.warn('Geolocation unavailable or denied, defaulting to Abuja Central', error);
        parkingStore.setUserLocation(9.0765, 7.4812);
        setUserLocation({ lat: 9.0765, lng: 7.4812 });
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleHeroFindParking = (district?: string) => {
    if (district) {
      setSelectedDistrict(district);
    }
    setHasScrolledToMap(true);
    setActiveBooking(null);
    const mapEl = document.getElementById('driver-map-section');
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSuccess = (booking: Booking) => {
    setActiveBooking(booking);
    setActiveTab('tickets');
  };

  const activeTicketsCount = bookings.filter(
    (b) => b.driver_id === currentUser.id && b.status === 'active'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8] text-[#1A2E2B] selection:bg-[#D4E157] selection:text-[#004D40]">
      {/* Offline Alert Indicator */}
      <OfflineIndicator />

      {/* Top Brand Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveBooking(null);
        }}
        currentUser={currentUser}
        onUpdateUser={(user) => {
          parkingStore.setCurrentUser(user);
          setCurrentUser(user);
        }}
        activeTicketsCount={activeTicketsCount}
      />

      {/* Main App Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* VIEW 1: ACTIVE DIGITAL TICKET DETAIL */}
        {activeBooking && (
          <DigitalTicketView
            booking={activeBooking}
            onBack={() => setActiveBooking(null)}
          />
        )}

        {/* VIEW 2: FIND PARKING (HERO + DRIVER MAP) */}
        {!activeBooking && activeTab === 'find' && (
          <div className="space-y-6">
            <LandingHero
              lots={lots}
              onFindParking={handleHeroFindParking}
              onSelectLot={(lot) => {
                const mapEl = document.getElementById('driver-map-section');
                if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="driver-map-section" className="pt-2">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <h2 className="font-editorial text-2xl font-bold text-[#004D40]">
                    Live Abuja Parking Map
                  </h2>
                  <p className="text-xs text-gray-500">
                    Bays update automatically when on-site attendants toggle occupancy.
                  </p>
                </div>
              </div>

              <DriverMapView
                lots={lots}
                bays={bays}
                userLocation={userLocation}
                onLocateMe={handleLocateMe}
                isLocating={isLocating}
                onBookingSuccess={handleBookingSuccess}
                initialDistrictFilter={selectedDistrict}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: MY PASSES & BOOKINGS */}
        {!activeBooking && activeTab === 'tickets' && (
          <MyPassesView
            bookings={bookings}
            onSelectBooking={(b) => setActiveBooking(b)}
            onFindParking={() => setActiveTab('find')}
          />
        )}

        {/* VIEW 4: ATTENDANT SENSOR DASHBOARD */}
        {!activeBooking && activeTab === 'attendant' && (
          <AttendantDashboard
            lots={lots}
            bays={bays}
            bookings={bookings}
          />
        )}

        {/* VIEW 5: ADMIN PLATFORM OVERSIGHT */}
        {!activeBooking && activeTab === 'admin' && (
          <AdminDashboard
            lots={lots}
            bookings={bookings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#00382E] text-[#F5F1E8]/70 text-xs py-8 border-t border-[#004D40] pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-white p-0.5 shadow-xs flex items-center justify-center">
              <ParkEasyIcon className="w-full h-full" />
            </div>
            <div className="font-sans font-black text-sm">
              <span className="text-white">Park</span>
              <span className="text-[#D4E157]">easy</span>
              <span className="text-[#F5F1E8]/70 font-normal ml-1.5 text-xs">Abuja</span>
            </div>
            <span>•</span>
            <span>A Renovate Africa Pilot Initiative</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Free Tier Architecture</span>
            <span>•</span>
            <span>Paystack Sandbox NGN</span>
            <span>•</span>
            <span>OpenStreetMap</span>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setActiveBooking(null);
        }}
        activeTicketsCount={activeTicketsCount}
      />
    </div>
  );
}
