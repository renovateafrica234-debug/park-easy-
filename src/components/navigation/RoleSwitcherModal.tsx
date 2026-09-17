import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types';
import { parkingStore } from '../../services/parkingStore';
import { DEFAULT_PROFILES } from '../../data/mockData';
import { X, UserCheck, Shield, HardHat, Car, Check } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-4 border border-[#004D40]/10">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#004D40]">Switch Role / Account</h3>
            <span className="text-[11px] text-gray-500">Test all three user flows in MVP</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {DEFAULT_PROFILES.map((profile) => {
            const isSelected = currentUser.id === profile.id;

            return (
              <button
                key={profile.id}
                onClick={() => {
                  onSelectUser(profile);
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#004D40] text-[#F5F1E8] border-[#004D40] shadow-sm'
                    : 'bg-[#F5F1E8] text-[#004D40] border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? 'bg-[#D4E157] text-[#004D40]' : 'bg-white text-[#004D40]'
                    }`}
                  >
                    {profile.role === 'driver' && <Car className="w-4 h-4" />}
                    {profile.role === 'attendant' && <HardHat className="w-4 h-4" />}
                    {profile.role === 'admin' && <Shield className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs block leading-tight">{profile.full_name}</span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider ${
                        isSelected ? 'text-[#D4E157]' : 'text-gray-500'
                      }`}
                    >
                      {profile.role}
                    </span>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-[#D4E157]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
