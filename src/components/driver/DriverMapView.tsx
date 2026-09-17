import React, { useState } from 'react';
import { ParkingLot, Bay, Booking } from '../../types';
import { ParkingMap } from '../map/ParkingMap';
import { LotDetailDrawer } from './LotDetailDrawer';
import { PaystackCheckoutModal } from './PaystackCheckoutModal';
import { Search, MapPin, ListFilter, Map, ShieldCheck, Umbrella, ArrowRight, Sparkles } from 'lucide-react';

interface DriverMapViewProps {
  lots: ParkingLot[];
  bays: Bay[];
  userLocation: { lat: number; lng: number };
  onLocateMe: () => void;
  isLocating: boolean;
  onBookingSuccess: (booking: Booking) => void;
  initialDistrictFilter?: string;
}

export const DriverMapView: React.FC<DriverMapViewProps> = ({
  lots,
  bays,
  userLocation,
  onLocateMe,
  isLocating,
  onBookingSuccess,
  initialDistrictFilter,
}) => {
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [selectedBayId, setSelectedBayId] = useState<string | undefined>(undefined);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState<string>(initialDistrictFilter || 'All');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const districts = ['All', 'Wuse 2', 'Central Business District', 'Maitama', 'Garki 2', 'Jabi', 'Utako'];

  // Filter lots by district and search query
  const filteredLots = lots.filter((lot) => {
    const matchesDistrict = districtFilter === 'All' || lot.district === districtFilter;
    const matchesSearch =
      lot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const handleStartBooking = (lot: ParkingLot, bayId?: string) => {
    setSelectedLot(lot);
    setSelectedBayId(bayId);
    setShowCheckoutModal(true);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Abuja streets (Aminu Kano, NNPC, Transcorp, Jabi Mall)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F1E8] border border-gray-200 rounded-2xl text-xs font-bold text-[#004D40] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#004D40]"
            />
          </div>

          {/* View Toggle (Map vs List) */}
          <div className="flex rounded-2xl bg-[#F5F1E8] p-1 border border-gray-200 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'map'
                  ? 'bg-[#004D40] text-[#D4E157] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-[#004D40] text-[#D4E157] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List ({filteredLots.length})</span>
            </button>
          </div>
        </div>

        {/* District Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setDistrictFilter(d)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                districtFilter === d
                  ? 'bg-[#004D40] text-[#D4E157]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="relative h-[62vh] min-h-[460px] w-full">
          <ParkingMap
            lots={filteredLots}
            selectedLot={selectedLot}
            onSelectLot={(lot) => setSelectedLot(lot)}
            userLocation={userLocation}
            onLocateMe={onLocateMe}
            isLocating={isLocating}
          />
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLots.map((lot) => {
            const isOpen = lot.open_bays > 0;

            return (
              <div
                key={lot.id}
                className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs hover:border-[#004D40]/30 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="bg-[#F5F1E8] text-[#004D40] text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                      {lot.district}
                    </span>
                    <span className="font-editorial text-lg font-black text-[#004D40]">
                      ₦{lot.price_per_hour}/hr
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#004D40] mt-2 leading-snug">
                    {lot.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#004D40] shrink-0" />
                    <span className="truncate">{lot.address}</span>
                  </p>
                </div>

                {/* Status bar */}
                <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Live Availability:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        isOpen ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}
                    >
                      {isOpen ? `${lot.open_bays} bays open` : 'FULL'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{lot.distance_km ? `${lot.distance_km} km away` : 'Abuja Metro'}</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#004D40]" /> Guarded
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <button
                  onClick={() => handleStartBooking(lot)}
                  disabled={!isOpen}
                  className="w-full py-2.5 bg-[#D4E157] hover:bg-[#c6d445] text-[#004D40] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isOpen ? 'Reserve & Pay' : 'Currently Full'}</span>
                  {isOpen && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Lot Bottom Sheet Drawer (Visible when a lot is selected in map mode) */}
      {selectedLot && (
        <LotDetailDrawer
          lot={selectedLot}
          bays={bays}
          onClose={() => setSelectedLot(null)}
          onStartBooking={handleStartBooking}
        />
      )}

      {/* Paystack Checkout Modal */}
      {showCheckoutModal && selectedLot && (
        <PaystackCheckoutModal
          lot={selectedLot}
          selectedBayId={selectedBayId}
          bays={bays}
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={(booking) => {
            setShowCheckoutModal(false);
            setSelectedLot(null);
            onBookingSuccess(booking);
          }}
        />
      )}
    </div>
  );
};
