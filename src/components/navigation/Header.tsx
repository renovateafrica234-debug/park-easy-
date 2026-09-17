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

        {/* Center: Official Parkeasy Brand Logo */}
        <div
          onClick={() => onSelectTab('find')}
          className="flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
          title="Parkeasy"
        >
          <img
            src="/logo.png"
            alt="Parkeasy"
            className="h-[44px] sm:h-[50px] md:h-[54px] w-auto object-contain drop-shadow-2xs"
          />
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
