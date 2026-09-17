import React, { useState } from 'react';
import { ParkingLot, Bay } from '../../types';
import { X, MapPin, Clock, ShieldCheck, Umbrella, Navigation, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LotDetailDrawerProps {
  lot: ParkingLot | null;
  bays: Bay[];
  onClose: () => void;
  onStartBooking: (lot: ParkingLot, selectedBayId?: string) => void;
}

export const LotDetailDrawer: React.FC<LotDetailDrawerProps> = ({
  lot,
  bays,
  onClose,
  onStartBooking,
}) => {
  const [selectedBayId, setSelectedBayId] = useState<string | undefined>(undefined);

  if (!lot) return null;

  const lotBays = bays.filter((b) => b.lot_id === lot.id);
  const isOpen = lot.open_bays > 0;

  // Directions deep link
  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lot.lat},${lot.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 max-w-xl mx-auto px-3 pb-3 sm:pb-6 pointer-events-none animate-in fade-in slide-in-from-bottom duration-200">
      <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl border border-[#004D40]/15 overflow-hidden">
        {/* Header Strip */}
        <div className="bg-[#004D40] text-[#F5F1E8] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4E157] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4E157]">
              {lot.district} • Abuja
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F5F1E8]/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#004D40] leading-tight">
                {lot.name}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#004D40]" />
                <span>{lot.address}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-2xl font-black text-[#004D40] font-editorial">
                ₦{lot.price_per_hour}
              </div>
              <span className="text-[11px] font-medium text-gray-400">per hour</span>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100">
            <div className="bg-[#F5F1E8] p-2.5 rounded-xl text-center">
              <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Availability
              </span>
              <span className={`text-sm font-bold ${isOpen ? 'text-[#004D40]' : 'text-red-600'}`}>
                {lot.open_bays} / {lot.total_bays} free
              </span>
            </div>
            <div className="bg-[#F5F1E8] p-2.5 rounded-xl text-center">
              <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Distance
              </span>
              <span className="text-sm font-bold text-[#004D40]">
                {lot.distance_km !== undefined ? `${lot.distance_km} km` : 'Near you'}
              </span>
            </div>
            <div className="bg-[#F5F1E8] p-2.5 rounded-xl text-center">
              <span className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                Security
              </span>
              <span className="text-sm font-bold text-[#004D40] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#004D40]" />
                Guard
              </span>
            </div>
          </div>

          {/* Amenities / Features */}
          <div className="flex flex-wrap gap-2 text-xs">
            {lot.covered && (
              <span className="inline-flex items-center gap-1 bg-[#004D40]/5 text-[#004D40] px-2.5 py-1 rounded-lg font-medium">
                <Umbrella className="w-3.5 h-3.5" /> Covered Parking
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-[#004D40]/5 text-[#004D40] px-2.5 py-1 rounded-lg font-medium">
              <Clock className="w-3.5 h-3.5" /> {lot.operating_hours}
            </span>
            <span className="inline-flex items-center gap-1 bg-[#D4E157]/20 text-[#004D40] px-2.5 py-1 rounded-lg font-bold">
              ⚡ Paystack Instant Confirmation
            </span>
          </div>

          {/* Interactive Mini Bay Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#004D40] uppercase tracking-wider">
                Select Space (Optional)
              </span>
              <span className="text-[11px] text-gray-400">
                {selectedBayId ? `Bay ${bays.find(b => b.id === selectedBayId)?.label} selected` : 'Auto-assigned if skipped'}
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#F5F1E8] rounded-xl border border-gray-200">
              {lotBays.map((bay) => {
                const isBayOpen = bay.status === 'open';
                const isBaySelected = selectedBayId === bay.id;

                return (
                  <button
                    key={bay.id}
                    disabled={!isBayOpen}
                    onClick={() => setSelectedBayId(isBaySelected ? undefined : bay.id)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center ${
                      isBaySelected
                        ? 'bg-[#004D40] text-[#D4E157] ring-2 ring-[#D4E157]'
                        : isBayOpen
                        ? 'bg-white text-[#004D40] border border-[#004D40]/20 hover:border-[#004D40]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed line-through'
                    }`}
                  >
                    <span>{bay.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={openDirections}
              className="px-4 py-3 bg-[#F5F1E8] hover:bg-[#eae5da] text-[#004D40] rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
              title="Open Navigation in Google Maps"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate</span>
            </button>

            <button
              id="reserve-pay-btn"
              disabled={!isOpen}
              onClick={() => onStartBooking(lot, selectedBayId)}
              className="flex-1 py-3 px-5 bg-[#D4E157] hover:bg-[#c6d445] text-[#004D40] rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#004D40]/10 transition active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isOpen ? 'Reserve & Pay (Paystack)' : 'Lot Full'}</span>
              {isOpen && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
