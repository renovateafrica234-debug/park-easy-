import React, { useState } from 'react';
import { ParkingLot, Bay, Booking } from '../../types';
import { parkingStore } from '../../services/parkingStore';
import { PLATFORM_COMMISSION_RATE } from '../../data/mockData';
import {
  Car,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  Building2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface AttendantDashboardProps {
  lots: ParkingLot[];
  bays: Bay[];
  bookings: Booking[];
}

export const AttendantDashboard: React.FC<AttendantDashboardProps> = ({ lots, bays, bookings }) => {
  const currentUser = parkingStore.getCurrentUser();
  const [selectedLotId, setSelectedLotId] = useState<string>(lots[0]?.id || '');
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string } | null>(null);

  const activeLot = lots.find((l) => l.id === selectedLotId) || lots[0];
  const lotBays = bays.filter((b) => b.lot_id === activeLot?.id);

  // Lot-specific bookings
  const lotBookings = bookings.filter((b) => b.lot_id === activeLot?.id);
  const todaysGross = lotBookings.reduce((sum, b) => sum + b.amount, 0);
  const platformCut = Math.round(todaysGross * PLATFORM_COMMISSION_RATE);
  const attendantNet = todaysGross - platformCut;

  const handleToggleBay = (bayId: string) => {
    parkingStore.toggleBayStatus(bayId);
  };

  const handleQuickCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInCode.trim()) return;

    const query = checkInCode.trim().toUpperCase();
    const match = lotBookings.find(
      (b) =>
        b.booking_code.toUpperCase().includes(query) ||
        b.vehicle_plate.toUpperCase().includes(query)
    );

    if (match) {
      if (match.status === 'completed') {
        setCheckInResult({
          success: false,
          message: `Booking ${match.booking_code} (${match.vehicle_plate}) is already completed.`,
        });
      } else {
        // Mark checked in / completed
        parkingStore.completeBooking(match.id);
        setCheckInResult({
          success: true,
          message: `Vehicle ${match.vehicle_plate} verified! Bay ${match.bay_label} released.`,
        });
        setCheckInCode('');
      }
    } else {
      setCheckInResult({
        success: false,
        message: `No active reservation found for "${checkInCode}". Check plate or code.`,
      });
    }

    setTimeout(() => setCheckInResult(null), 5000);
  };

  const handleMarkAllOpen = () => {
    lotBays.forEach((bay) => {
      if (bay.status === 'occupied') {
        parkingStore.setBayStatus(bay.id, 'open');
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-[#004D40] text-[#F5F1E8] p-6 rounded-3xl shadow-lg border border-[#004D40]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold">
            Lot Management & Live Bays
          </h1>
          <p className="text-xs text-[#F5F1E8]/85 mt-1">
            Logged in as <strong className="text-white">{currentUser.full_name}</strong> • Tap any bay to update occupancy in real time.
          </p>
        </div>

        {/* Lot Selector */}
        <div className="flex items-center gap-2 bg-[#00382E] p-2 rounded-2xl border border-white/10">
          <Building2 className="w-4 h-4 text-[#D4E157] shrink-0 ml-1" />
          <select
            value={selectedLotId}
            onChange={(e) => setSelectedLotId(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4"
          >
            {lots.map((lot) => (
              <option key={lot.id} value={lot.id} className="bg-[#00382E] text-white">
                {lot.name} ({lot.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Bookings</span>
            <TrendingUp className="w-4 h-4 text-[#004D40]" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-[#004D40]">
            ₦{todaysGross.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {lotBookings.length} total reservations today
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Fee (12%)</span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
              Auto-Cut
            </span>
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-gray-700">
            ₦{platformCut.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            ParkEasy technology & payment processing
          </span>
        </div>

        <div className="bg-[#D4E157]/20 border border-[#D4E157] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#004D40] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Net Owed to Lot Owner</span>
            <Wallet className="w-4 h-4 text-[#004D40]" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-[#004D40]">
            ₦{attendantNet.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-[#004D40]/80 mt-1 block">
            Batch settlement: Zenith Bank (Acct: ...984)
          </span>
        </div>
      </div>

      {/* Main Interactive Bay Grid & Quick Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bay Grid (Takes 2 cols on lg) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-editorial text-xl font-bold text-[#004D40]">
                {activeLot?.name} — Bay Grid
              </h2>
              <p className="text-xs text-gray-500">
                Tap any bay to manually flip status. Drivers&#39; live map updates instantly!
              </p>
            </div>

            <button
              onClick={handleMarkAllOpen}
              className="text-xs font-bold text-[#004D40] bg-[#F5F1E8] hover:bg-gray-200 px-3 py-1.5 rounded-xl border border-gray-300 transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Occupied Bays</span>
            </button>
          </div>

          {/* Bay Status Summary Pills */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              {activeLot?.open_bays} Open (Tap to occupy)
            </span>
            <span className="flex items-center gap-1.5 text-red-800 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              {activeLot?.occupied_bays} Occupied
            </span>
            <span className="flex items-center gap-1.5 text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              {activeLot?.reserved_bays} Reserved
            </span>
          </div>

          {/* The Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {lotBays.map((bay) => {
              const isOpen = bay.status === 'open';
              const isOccupied = bay.status === 'occupied';
              const isReserved = bay.status === 'reserved';

              return (
                <button
                  key={bay.id}
                  onClick={() => handleToggleBay(bay.id)}
                  className={`p-3 rounded-2xl transition-all duration-150 text-center flex flex-col items-center justify-center gap-1.5 border-2 active:scale-95 shadow-xs ${
                    isOpen
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 hover:bg-emerald-100'
                      : isOccupied
                      ? 'bg-rose-50 border-rose-400 text-rose-900 hover:bg-rose-100'
                      : 'bg-blue-50 border-blue-400 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <span className="font-editorial text-lg font-black">{bay.label}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isOpen
                        ? 'bg-emerald-200 text-emerald-900'
                        : isOccupied
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-blue-200 text-blue-900'
                    }`}
                  >
                    {bay.status}
                  </span>
                  {bay.vehicle_plate && (
                    <span className="text-[10px] font-mono font-semibold truncate max-w-full text-gray-600">
                      {bay.vehicle_plate}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Attendant Check-in & Recent Activity (1 col on lg) */}
        <div className="space-y-6">
          {/* Quick Check-In / Ticket Scanner */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="font-editorial text-base font-bold text-[#004D40] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#004D40]" />
              Driver Check-in & Release
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Enter vehicle plate or driver&#39;s 4-digit booking code to verify and release bay.
            </p>

            <form onSubmit={handleQuickCheckIn} className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={checkInCode}
                  onChange={(e) => setCheckInCode(e.target.value)}
                  placeholder="e.g. ABJ-772 or 8192"
                  className="w-full pl-10 pr-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-[#004D40] focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#004D40] hover:bg-[#00382E] text-[#D4E157] rounded-xl font-bold text-xs shadow-xs transition"
              >
                Verify & Check In
              </button>
            </form>

            {checkInResult && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  checkInResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {checkInResult.message}
              </div>
            )}
          </div>

          {/* Today's Lot Bookings List */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
            <h3 className="font-editorial text-base font-bold text-[#004D40]">
              Recent Lot Activity
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {lotBookings.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  No reservations logged yet today.
                </div>
              ) : (
                lotBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 bg-[#F5F1E8] rounded-xl border border-gray-200 text-xs flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#004D40]">
                        <span className="font-editorial font-black bg-white px-1.5 py-0.5 rounded text-[11px] border border-gray-200">
                          Bay {b.bay_label}
                        </span>
                        <span>{b.vehicle_plate}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        {b.driver_name} • {b.booking_code}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[#004D40]">₦{b.amount}</span>
                      <span
                        className={`text-[10px] block font-semibold ${
                          b.status === 'active' ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
