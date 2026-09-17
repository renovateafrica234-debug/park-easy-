import React from 'react';
import { MapPin, Ticket, HardHat, Shield } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'find' | 'tickets' | 'attendant' | 'admin';
  onSelectTab: (tab: 'find' | 'tickets' | 'attendant' | 'admin') => void;
  activeTicketsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  activeTicketsCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
      <button
        onClick={() => onSelectTab('find')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
          activeTab === 'find' ? 'text-[#025969] font-bold' : 'text-gray-400 font-medium'
        }`}
      >
        <MapPin className={`w-5 h-5 ${activeTab === 'find' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Find</span>
      </button>

      <button
        onClick={() => onSelectTab('tickets')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition relative ${
          activeTab === 'tickets' ? 'text-[#025969] font-bold' : 'text-gray-400 font-medium'
        }`}
      >
        <Ticket className={`w-5 h-5 ${activeTab === 'tickets' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">My Pass</span>
        {activeTicketsCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#C7D810]" />
        )}
      </button>

      <button
        onClick={() => onSelectTab('attendant')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
          activeTab === 'attendant' ? 'text-[#025969] font-bold' : 'text-gray-400 font-medium'
        }`}
      >
        <HardHat className={`w-5 h-5 ${activeTab === 'attendant' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Attendant</span>
      </button>

      <button
        onClick={() => onSelectTab('admin')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
          activeTab === 'admin' ? 'text-[#025969] font-bold' : 'text-gray-400 font-medium'
        }`}
      >
        <Shield className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Admin</span>
      </button>
    </div>
  );
};
