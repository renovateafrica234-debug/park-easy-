import React from 'react';
import { Booking } from '../../types';
import { Ticket, MapPin, Clock, ArrowRight, Car, QrCode } from 'lucide-react';

interface MyPassesViewProps {
  bookings: Booking[];
  onSelectBooking: (booking: Booking) => void;
  onFindParking: () => void;
}

export const MyPassesView: React.FC<MyPassesViewProps> = ({
  bookings,
  onSelectBooking,
  onFindParking,
}) => {
  const activeBookings = bookings.filter((b) => b.status === 'active');
  const pastBookings = bookings.filter((b) => b.status !== 'active');

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-20 md:pb-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#004D40]">
            My Parking Passes & Digital Tickets
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time access passes, QR codes, and Paystack receipts
          </p>
        </div>

        <button
          onClick={onFindParking}
          className="px-4 py-2 bg-[#004D40] text-[#D4E157] rounded-xl text-xs font-bold hover:bg-[#00382E] transition self-start sm:self-auto"
        >
          + Find New Parking Spot
        </button>
      </div>

      {/* Active Passes Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-[#004D40] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Active Parking Passes ({activeBookings.length})
        </h2>

        {activeBookings.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center space-y-3">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto" />
            <div className="text-sm font-bold text-gray-700">No active parking sessions</div>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You don&#39;t have any active bays reserved right now. Find parking in Abuja and pay with Paystack in seconds.
            </p>
            <button
              onClick={onFindParking}
              className="mt-2 px-5 py-2.5 bg-[#D4E157] text-[#004D40] rounded-xl font-bold text-xs"
            >
              Find Parking Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                className="bg-white rounded-3xl border-2 border-[#004D40] p-5 shadow-md hover:shadow-lg transition cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                      Active Pass
                    </span>
                    <span className="font-mono text-xs font-bold text-[#004D40]">
                      {b.booking_code}
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg font-bold text-[#004D40] mt-2">
                    {b.lot_name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#004D40]" />
                    <span className="truncate">{b.lot_address}</span>
                  </p>
                </div>

                <div className="bg-[#F5F1E8] p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#004D40] text-[#D4E157] font-editorial font-black text-lg flex items-center justify-center">
                      {b.bay_label}
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Plate</span>
                      <span className="font-mono font-bold text-[#004D40]">{b.vehicle_plate}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Expires</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {new Date(b.ends_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500">Paid ₦{b.amount} (Paystack)</span>
                  <span className="font-bold text-[#004D40] flex items-center gap-1 hover:underline">
                    <span>View QR Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past History */}
      {pastBookings.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">
            Parking History ({pastBookings.length})
          </h2>

          <div className="space-y-2">
            {pastBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                className="bg-white p-4 rounded-2xl border border-gray-200 text-xs flex items-center justify-between gap-3 hover:border-gray-300 transition cursor-pointer"
              >
                <div>
                  <div className="font-bold text-[#004D40] text-sm">{b.lot_name}</div>
                  <div className="text-gray-400 text-[11px] mt-0.5">
                    {new Date(b.started_at).toLocaleDateString()} • Bay {b.bay_label} • {b.vehicle_plate}
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-gray-800 block">₦{b.amount}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
