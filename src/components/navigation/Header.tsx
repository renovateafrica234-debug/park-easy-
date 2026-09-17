import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { MapPin, Ticket, HardHat, Shield, Car } from 'lucide-react';

interface HeaderProps {
  activeTab: 'find' | 'tickets' | 'attendant' | 'admin';
  onSelectTab: (tab: 'find' | 'tickets' | 'attendant' | 'admin') => void;
  currentUser: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  activeTicketsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  onUpdateUser,
  activeTicketsCount,
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Left Side: Desktop Navigation Links (or mobile spacer for true center alignment) */}
        <div className="flex-1 hidden md:flex items-center justify-start">
          <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/70 text-xs font-semibold">
            <button
              onClick={() => onSelectTab('find')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'find'
                  ? 'bg-[#025969] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Find Parking</span>
            </button>

            <button
              onClick={() => onSelectTab('tickets')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 relative ${
                activeTab === 'tickets'
                  ? 'bg-[#025969] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>My Passes</span>
              {activeTicketsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#C7D810] animate-ping" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('attendant')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'attendant'
                  ? 'bg-[#025969] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Attendant</span>
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-[#025969] text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </nav>
        </div>

        {/* Mobile Left Spacer to keep center logo mathematically centered */}
        <div className="flex-1 md:hidden" />

        {/* Center: Official Parkeasy Brand Logo Lockup */}
        <div
          onClick={() => onSelectTab('find')}
          className="flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer select-none group max-h-[45px] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          title="Parkeasy"
        >
          {/* Inline SVG rendering the official Stylized Location Pin with Infinity Loop / Trapezoid Base */}
          <svg
            viewBox="0 0 100 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 sm:h-9 md:h-10 w-auto max-h-[42px] shrink-0"
            aria-label="Parkeasy Icon"
          >
            <defs>
              <linearGradient id="headerParkeasyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2D8C3E" />
                <stop offset="100%" stopColor="#C7D810" />
              </linearGradient>
            </defs>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="
                M 50 5
                C 28.5 5 11 22.5 11 44
                C 11 53.6 14.4 62.4 20.1 69.3
                L 9.5 98.6
                C 8.2 102.2 10.8 106 14.7 106
                L 35.5 106
                C 38 106 40.4 104.6 41.6 102.4
                L 50 87
                L 58.4 102.4
                C 59.6 104.6 62 106 64.5 106
                L 85.3 106
                C 89.2 106 91.8 102.2 90.5 98.6
                L 79.9 69.3
                C 85.6 62.4 89 53.6 89 44
                C 89 22.5 71.5 5 50 5
                Z
                M 50 84
                L 63 107
                L 37 107
                Z
                M 23 44
                C 23 29.1 35.1 17 50 17
                C 64.9 17 77 29.1 77 44
                C 77 55.4 69.9 65.2 59.8 69.2
                L 54.8 59.8
                C 61.2 56.6 65.5 50.8 65.5 44
                C 65.5 35.4 58.6 28.5 50 28.5
                C 41.4 28.5 34.5 35.4 34.5 44
                C 34.5 48.2 36.1 52 38.8 54.8
                L 30.5 62.5
                C 25.8 57.7 23 51.2 23 44
                Z
                M 50 34
                C 55.5 34 60 38.5 60 44
                C 60 49.5 55.5 54 50 54
                C 44.5 54 40 49.5 40 44
                C 40 38.5 44.5 34 50 34
                Z
              "
              fill="url(#headerParkeasyGrad)"
            />
          </svg>

          {/* Wordmark: "Park" in Teal (#025969) & "easy" in Lemon (#C7D810) */}
          <div className="flex items-center leading-none">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans flex items-baseline">
              <span style={{ color: '#025969' }}>Park</span>
              <span style={{ color: '#C7D810' }}>easy</span>
            </span>
          </div>
        </div>

        {/* Right Side: PWA Install & User Role Button */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <PWAInstallButton />

          <button
            id="role-switcher-btn"
            onClick={() => setShowRoleModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-full border border-slate-200/80 text-xs font-semibold transition active:scale-95"
            title="Switch User Role (Driver, Attendant, Admin)"
          >
            <div className="w-5 h-5 rounded-full bg-[#025969] text-[#C7D810] flex items-center justify-center font-bold text-[10px]">
              {currentUser.role === 'driver' && <Car className="w-3 h-3" />}
              {currentUser.role === 'attendant' && <HardHat className="w-3 h-3" />}
              {currentUser.role === 'admin' && <Shield className="w-3 h-3" />}
            </div>
            <span className="hidden sm:inline capitalize font-medium">{currentUser.role}</span>
          </button>
        </div>
      </div>

      <RoleSwitcherModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        currentUser={currentUser}
        onSelectUser={onUpdateUser}
      />
    </header>
  );
};
