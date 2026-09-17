import React from 'react';
import { ParkingLot } from '../../types';
import { Search, MapPin, Sparkles, Shield, Zap, ArrowRight, Navigation } from 'lucide-react';

interface LandingHeroProps {
  lots: ParkingLot[];
  onFindParking: (district?: string) => void;
  onSelectLot: (lot: ParkingLot) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ lots, onFindParking, onSelectLot }) => {
  const totalOpenBays = lots.reduce((sum, l) => sum + l.open_bays, 0);

  const districts = [
    'All Abuja',
    'Wuse 2',
    'Central Business District',
    'Maitama',
    'Garki 2',
    'Jabi',
    'Utako',
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Jumbotron with Renovate Africa Brand */}
      <div className="relative rounded-3xl bg-[#004D40] text-[#F5F1E8] p-6 sm:p-10 shadow-xl overflow-hidden border border-[#004D40]/30">
        {/* Background decorative SVG circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#D4E157]/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-[#00382E] blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <h1 className="font-editorial text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            What if Abuja&#39;s roads could tell you where to park?
          </h1>

          <p className="text-sm sm:text-base text-[#F5F1E8]/85 leading-relaxed font-normal max-w-xl">
            Never waste fuel or circle around Wuse 2, CBD, or Maitama again. View real-time empty bays, reserve your spot instantly, and pay securely via Paystack.
          </p>

          {/* Quick CTA & Live Stat Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="hero-find-parking-btn"
              onClick={() => onFindParking()}
              className="px-6 py-4 bg-[#D4E157] hover:bg-[#c6d445] text-[#004D40] rounded-2xl font-black text-sm sm:text-base shadow-lg transition active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Navigation className="w-5 h-5 fill-[#004D40]" />
              <span>Find Open Bays Nearby</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 bg-[#00382E]/80 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/10 text-xs font-semibold">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <span className="text-white font-bold block">{totalOpenBays} Bays Available</span>
                <span className="text-[10px] text-[#F5F1E8]/70">across {lots.length} active Abuja locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* District Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {districts.map((district) => (
          <button
            key={district}
            onClick={() => onFindParking(district === 'All Abuja' ? undefined : district)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#004D40] bg-white hover:bg-[#D4E157]/20 border border-gray-200 transition shrink-0 shadow-2xs active:scale-95"
          >
            {district}
          </button>
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#004D40]/10 text-[#004D40] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#004D40]">Instant Digital Pass</h4>
            <p className="text-gray-500 text-[11px] mt-0.5">
              QR confirmation with real-time countdown timer directly on your phone.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#004D40]/10 text-[#004D40] shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#004D40]">Paystack Cashless</h4>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Zero manual cash hassles or roadside arguments. Pay cards, transfer, or USSD.
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#004D40]/10 text-[#004D40] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-[#004D40]">Live Attendant Sync</h4>
            <p className="text-gray-500 text-[11px] mt-0.5">
              On-site attendants toggle bays so your map colors reflect current availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
