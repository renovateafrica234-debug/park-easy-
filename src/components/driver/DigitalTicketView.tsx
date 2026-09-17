import React, { useEffect, useState } from 'react';
import { Booking } from '../../types';
import { parkingStore } from '../../services/parkingStore';
import { ParkEasyIcon } from '../brand/ParkEasyIcon';
import { CheckCircle2, Clock, MapPin, Navigation, Car, QrCode, Copy, Check, Plus, ArrowLeft } from 'lucide-react';

interface DigitalTicketViewProps {
  booking: Booking;
  onBack: () => void;
}

export const DigitalTicketView: React.FC<DigitalTicketViewProps> = ({ booking: initialBooking, onBack }) => {
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [copied, setCopied] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  // Live countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(booking.ends_at).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isExpired: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [booking.ends_at]);

  const copyCode = () => {
    navigator.clipboard.writeText(booking.booking_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.lat},${booking.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleExtendHour = () => {
    setIsExtending(true);
    setTimeout(() => {
      const updated = parkingStore.extendBooking(booking.id, 1);
      if (updated) {
        setBooking({ ...updated });
      }
      setIsExtending(false);
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 space-y-5 animate-in fade-in duration-300">
      {/* Top bar */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#004D40] bg-white px-3.5 py-1.5 rounded-full shadow-xs hover:bg-[#F5F1E8] transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Map</span>
      </button>

      {/* Main Ticket Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-[#004D40]/15 overflow-hidden">
        {/* Ticket Header */}
        <div className="bg-[#004D40] text-[#F5F1E8] p-6 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-md bg-white p-0.5 shadow-xs flex items-center justify-center">
              <ParkEasyIcon className="w-full h-full" />
            </div>
            <span className="font-sans font-bold text-xs text-white/90">ParkEasy Abuja Digital Pass</span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#D4E157] text-[#004D40] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Digital Pass Active</span>
          </div>
          <h2 className="font-editorial text-2xl font-bold">{booking.lot_name}</h2>
          <p className="text-xs text-[#F5F1E8]/80 mt-1 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{booking.lot_address}</span>
          </p>

          {/* Bay Assignment Circle */}
          <div className="mt-4 inline-flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-[#D4E157] text-[#004D40] shadow-lg border-2 border-white">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bay</span>
            <span className="font-editorial text-3xl font-black">{booking.bay_label}</span>
          </div>
        </div>

        {/* Live Countdown Timer Section */}
        <div className="bg-[#F5F1E8] px-6 py-4 border-y border-[#004D40]/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#004D40]">
            <Clock className="w-4 h-4 text-[#004D40]" />
            <span>Time Remaining</span>
          </div>

          <div className="font-mono text-lg font-black text-[#004D40] bg-white px-3 py-1 rounded-xl shadow-xs border border-gray-200">
            {timeLeft.isExpired ? (
              <span className="text-red-600 font-sans text-xs">EXPIRED</span>
            ) : (
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {/* QR Code & Passcode */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-[#004D40]/30 shadow-inner relative">
            {/* SVG Visual QR representation */}
            <div className="relative w-40 h-40 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 160 160" fill="none">
                <rect width="160" height="160" fill="#ffffff" />
                {/* Corner squares */}
                <rect x="10" y="10" width="40" height="40" rx="4" fill="#004D40" />
                <rect x="18" y="18" width="24" height="24" fill="#ffffff" />
                <rect x="24" y="24" width="12" height="12" fill="#004D40" />

                <rect x="110" y="10" width="40" height="40" rx="4" fill="#004D40" />
                <rect x="118" y="18" width="24" height="24" fill="#ffffff" />
                <rect x="124" y="24" width="12" height="12" fill="#004D40" />

                <rect x="10" y="110" width="40" height="40" rx="4" fill="#004D40" />
                <rect x="18" y="118" width="24" height="24" fill="#ffffff" />
                <rect x="24" y="124" width="12" height="12" fill="#004D40" />

                {/* Data matrix dots */}
                <rect x="60" y="20" width="8" height="8" fill="#004D40" />
                <rect x="75" y="20" width="8" height="8" fill="#004D40" />
                <rect x="90" y="20" width="8" height="8" fill="#004D40" />

                <rect x="20" y="60" width="8" height="8" fill="#004D40" />
                <rect x="40" y="60" width="8" height="8" fill="#004D40" />
                <rect x="60" y="60" width="8" height="8" fill="#D4E157" />
                <rect x="80" y="60" width="8" height="8" fill="#004D40" />
                <rect x="100" y="60" width="8" height="8" fill="#004D40" />
                <rect x="120" y="60" width="8" height="8" fill="#004D40" />

                <rect x="60" y="80" width="8" height="8" fill="#004D40" />
                <rect x="80" y="80" width="12" height="12" fill="#004D40" />
                <rect x="110" y="80" width="8" height="8" fill="#004D40" />

                <rect x="60" y="110" width="8" height="8" fill="#004D40" />
                <rect x="80" y="110" width="8" height="8" fill="#004D40" />
                <rect x="100" y="120" width="8" height="8" fill="#004D40" />
                <rect x="120" y="130" width="12" height="12" fill="#004D40" />
                <rect x="140" y="110" width="8" height="8" fill="#004D40" />
              </svg>

              {/* Center Branded QR Stamp */}
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-lg bg-white p-0.5 shadow-md border border-gray-100 flex items-center justify-center">
                <ParkEasyIcon className="w-full h-full" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 mt-1 block">
              Scan at lot entry or show to attendant
            </span>
          </div>

          {/* Passcode Copy Pill */}
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-base font-black tracking-wider text-[#004D40] bg-[#F5F1E8] px-3.5 py-1.5 rounded-xl border border-gray-300">
              {booking.booking_code}
            </span>
            <button
              onClick={copyCode}
              className="p-2 bg-white border border-gray-200 hover:bg-[#F5F1E8] text-[#004D40] rounded-xl transition shadow-xs"
              title="Copy Booking Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Ticket Information Grid */}
          <div className="grid grid-cols-2 gap-3 text-left pt-2 border-t border-gray-100 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px]">Vehicle Plate</span>
              <span className="font-bold text-[#004D40] flex items-center gap-1 mt-0.5">
                <Car className="w-3.5 h-3.5" />
                {booking.vehicle_plate}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Amount Paid</span>
              <span className="font-bold text-[#004D40] mt-0.5 block">
                ₦{booking.amount} (Paystack)
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Started At</span>
              <span className="font-semibold text-gray-700 mt-0.5 block">
                {new Date(booking.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Expires At</span>
              <span className="font-semibold text-gray-700 mt-0.5 block">
                {new Date(booking.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-3">
            <button
              onClick={handleOpenNavigation}
              className="w-full py-3 bg-[#004D40] hover:bg-[#00382E] text-[#D4E157] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate in Google Maps</span>
            </button>

            <button
              onClick={handleExtendHour}
              disabled={isExtending}
              className="w-full py-3 bg-[#F5F1E8] hover:bg-[#eae4d6] text-[#004D40] border border-[#004D40]/20 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isExtending ? 'Adding...' : 'Extend +1 Hour'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
