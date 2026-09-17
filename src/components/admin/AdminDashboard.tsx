import React, { useState } from 'react';
import { ParkingLot, Booking } from '../../types';
import { parkingStore } from '../../services/parkingStore';
import {
  ShieldAlert,
  Download,
  Plus,
  Building2,
  Receipt,
  Percent,
  TrendingUp,
  Database,
  CheckCircle,
  Copy,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

interface AdminDashboardProps {
  lots: ParkingLot[];
  bookings: Booking[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ lots, bookings }) => {
  const stats = parkingStore.getPlatformStats();
  const [showAddLotModal, setShowAddLotModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // New lot form state
  const [newLotName, setNewLotName] = useState('');
  const [newLotAddress, setNewLotAddress] = useState('');
  const [newLotDistrict, setNewLotDistrict] = useState('Wuse 2');
  const [newLotLat, setNewLotLat] = useState('9.0765');
  const [newLotLng, setNewLotLng] = useState('7.4812');
  const [newLotPrice, setNewLotPrice] = useState('400');
  const [newLotBays, setNewLotBays] = useState('16');
  const [newLotCovered, setNewLotCovered] = useState(true);

  // Filter bookings
  const filteredBookings = bookings.filter(
    (b) =>
      b.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicle_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.driver_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export Bookings to CSV
  const handleExportCsv = () => {
    const headers = [
      'Booking ID',
      'Booking Code',
      'Date & Time',
      'Driver Name',
      'Vehicle Plate',
      'Parking Lot',
      'Bay',
      'Duration (Hrs)',
      'Gross Amount (NGN)',
      'Platform Fee (12%)',
      'Net Owed (88%)',
      'Status',
      'Paystack Ref',
    ];

    const rows = bookings.map((b) => [
      b.id,
      b.booking_code,
      new Date(b.created_at).toLocaleString(),
      `"${b.driver_name}"`,
      b.vehicle_plate,
      `"${b.lot_name}"`,
      b.bay_label,
      b.duration_hours,
      b.amount,
      b.platform_fee,
      b.attendant_payout,
      b.status,
      b.paystack_ref,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ParkEasy_Abuja_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLotName.trim()) return;

    parkingStore.addLot({
      owner_id: 'user-attendant-1',
      name: newLotName.trim(),
      address: newLotAddress.trim() || `${newLotDistrict}, Abuja`,
      district: newLotDistrict,
      lat: parseFloat(newLotLat) || 9.0765,
      lng: parseFloat(newLotLng) || 7.4812,
      price_per_hour: parseInt(newLotPrice, 10) || 400,
      total_bays: parseInt(newLotBays, 10) || 16,
      covered: newLotCovered,
      security_guarded: true,
      operating_hours: '07:00 AM - 10:00 PM',
    });

    setShowAddLotModal(false);
    setNewLotName('');
    setNewLotAddress('');
  };

  const supabaseSqlScript = `-- ParkEasy Abuja: Supabase Database Schema + Row Level Security (RLS)
-- Run this in your Supabase project SQL Editor

-- 1. Profiles Table (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  role text check (role in ('driver','attendant','admin')) default 'driver',
  created_at timestamptz default now()
);

-- 2. Parking Lots
create table if not exists lots (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  name text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  price_per_hour numeric not null,
  total_bays int not null,
  created_at timestamptz default now()
);

-- 3. Bays
create table if not exists bays (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid references lots(id) on delete cascade,
  label text, -- e.g. "A1"
  status text check (status in ('open','occupied','reserved')) default 'open'
);

-- 4. Bookings & Paystack Ledger
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references profiles(id),
  bay_id uuid references bays(id),
  lot_id uuid references lots(id),
  amount numeric not null,
  platform_fee numeric not null, -- 12% commission
  status text check (status in ('pending','paid','active','completed','cancelled')) default 'pending',
  paystack_ref text,
  started_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) Policies
alter table profiles enable row level security;
alter table lots enable row level security;
alter table bays enable row level security;
alter table bookings enable row level security;

-- Drivers can read all lots & bays
create policy "Public can read lots" on lots for select using (true);
create policy "Public can read bays" on bays for select using (true);

-- Attendants can manage their own lot bays
create policy "Attendants can update own bays" on bays
  for update using (
    exists (select 1 from lots where lots.id = bays.lot_id and lots.owner_id = auth.uid())
  );

-- Drivers can create & read their bookings
create policy "Drivers can insert bookings" on bookings
  for insert with check (auth.uid() = driver_id);

create policy "Drivers can read own bookings" on bookings
  for select using (auth.uid() = driver_id);
`;

  const copySql = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="bg-[#004D40] text-[#F5F1E8] p-6 rounded-3xl shadow-lg border border-[#004D40]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold">
            Platform Administration
          </h1>
          <p className="text-xs text-[#F5F1E8]/80 mt-1">
            Abuja municipal parking oversight, commission ledger, and lot configurations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-[#F5F1E8] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-[#D4E157]" />
            <span>Supabase Schema</span>
          </button>

          <button
            onClick={() => setShowAddLotModal(true)}
            className="px-3.5 py-2 bg-[#D4E157] hover:bg-[#c6d445] text-[#004D40] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lot</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Bookings</span>
            <TrendingUp className="w-4 h-4 text-[#004D40]" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-[#004D40]">
            ₦{stats.grossVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Paystack total processed</span>
        </div>

        <div className="bg-[#D4E157]/20 border border-[#D4E157] p-5 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-[#004D40] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Commission (12%)</span>
            <Percent className="w-4 h-4 text-[#004D40]" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-[#004D40]">
            ₦{stats.platformCommissionEarned.toLocaleString()}
          </div>
          <span className="text-[11px] font-semibold text-[#004D40]/80 mt-1 block">
            Net Platform Revenue
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Net Owed Lots</span>
            <Receipt className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-gray-800">
            ₦{stats.totalNetPayouts.toLocaleString()}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Ready for manual batch payout</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Occupancy Rate</span>
            <Building2 className="w-4 h-4 text-[#004D40]" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-black text-[#004D40]">
            {stats.occupancyRate}%
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {stats.openBays} of {stats.totalBays} bays open across {stats.totalLots} lots
          </span>
        </div>
      </div>

      {/* Lots Overview */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl font-bold text-[#004D40]">
            Abuja Parking Network ({lots.length} Locations)
          </h2>
          <span className="text-xs text-gray-400">Live bay status syncing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {lots.map((lot) => (
            <div
              key={lot.id}
              className="p-4 bg-[#F5F1E8] rounded-2xl border border-gray-200 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-[#004D40] text-sm leading-tight">{lot.name}</span>
                <span className="bg-[#004D40] text-[#D4E157] font-editorial font-bold px-1.5 py-0.5 rounded text-[11px] shrink-0">
                  ₦{lot.price_per_hour}/hr
                </span>
              </div>
              <span className="text-[11px] text-gray-500 block truncate">{lot.address}</span>

              <div className="flex items-center justify-between pt-1 border-t border-gray-200 text-[11px] font-semibold">
                <span className="text-[#004D40]">{lot.open_bays} open bays</span>
                <span className="text-gray-400">{lot.total_bays} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions & Paystack Ledger */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#004D40]">
              Paystack Transactions & Payout Ledger
            </h2>
            <p className="text-xs text-gray-500">
              12% commission automatically recorded on every transaction
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search code, plate, driver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-[#F5F1E8] border border-gray-300 rounded-xl text-xs text-[#004D40] focus:outline-none focus:ring-2 focus:ring-[#004D40]"
            />

            <button
              id="export-csv-btn"
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-[#004D40] hover:bg-[#00382E] text-[#D4E157] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F1E8] text-[#004D40] border-b border-gray-200 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Driver / Plate</th>
                <th className="py-3 px-3">Lot & Bay</th>
                <th className="py-3 px-3 text-right">Gross (₦)</th>
                <th className="py-3 px-3 text-right">Fee (12%)</th>
                <th className="py-3 px-3 text-right">Net Payout</th>
                <th className="py-3 px-3">Paystack Ref</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-[#004D40]">{b.booking_code}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-gray-800">{b.driver_name}</div>
                    <span className="text-[10px] font-mono text-gray-500">{b.vehicle_plate}</span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-gray-700 truncate max-w-[140px]">{b.lot_name}</div>
                    <span className="text-[10px] text-gray-500 font-bold">Bay {b.bay_label}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-gray-900">₦{b.amount}</td>
                  <td className="py-3 px-3 text-right font-bold text-[#004D40]">₦{b.platform_fee}</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700">₦{b.attendant_payout}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-gray-400">{b.paystack_ref}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add New Lot */}
      {showAddLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-editorial text-xl font-bold text-[#004D40]">Add New Abuja Parking Lot</h3>
            <form onSubmit={handleCreateLot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#004D40] mb-1">Lot Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silverbird Galleria Parking Deck"
                  value={newLotName}
                  onChange={(e) => setNewLotName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#004D40] focus:outline-none text-[#004D40] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#004D40] mb-1">District</label>
                <select
                  value={newLotDistrict}
                  onChange={(e) => setNewLotDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-[#004D40] font-medium focus:outline-none"
                >
                  <option value="Wuse 2">Wuse 2</option>
                  <option value="Central Business District">Central Business District</option>
                  <option value="Maitama">Maitama</option>
                  <option value="Garki 2">Garki 2</option>
                  <option value="Jabi">Jabi</option>
                  <option value="Utako">Utako</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#004D40] mb-1">Exact Address</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 1161 Memorial Drive, CBD, Abuja"
                  value={newLotAddress}
                  onChange={(e) => setNewLotAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-[#004D40] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#004D40] mb-1">Price / Hour (₦)</label>
                  <input
                    type="number"
                    value={newLotPrice}
                    onChange={(e) => setNewLotPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-[#004D40] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#004D40] mb-1">Total Bays</label>
                  <input
                    type="number"
                    value={newLotBays}
                    onChange={(e) => setNewLotBays(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-[#004D40] font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="covered-parking"
                  checked={newLotCovered}
                  onChange={(e) => setNewLotCovered(e.target.checked)}
                  className="rounded text-[#004D40] focus:ring-[#004D40]"
                />
                <label htmlFor="covered-parking" className="font-semibold text-gray-700">
                  Covered / Shaded Structure
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddLotModal(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#004D40] hover:bg-[#00382E] text-[#D4E157] font-bold rounded-xl shadow-xs"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Supabase SQL & RLS Scripts */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#004D40]">
                  Supabase SQL Schema & RLS Policies
                </h3>
                <span className="text-xs text-gray-500">
                  Ready to paste directly into the Supabase SQL Editor
                </span>
              </div>
              <button
                onClick={copySql}
                className="px-3 py-1.5 bg-[#004D40] hover:bg-[#00382E] text-[#D4E157] rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                {copiedSql ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-900 text-gray-200 p-4 rounded-2xl font-mono text-xs leading-relaxed border border-gray-800">
              <pre>{supabaseSqlScript}</pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
