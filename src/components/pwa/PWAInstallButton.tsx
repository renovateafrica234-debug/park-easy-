import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { ParkEasyIcon } from '../brand/ParkEasyIcon';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-[#D4E157] px-3.5 py-1.5 text-xs font-semibold text-[#004D40] shadow-sm hover:bg-[#c4d14b] active:scale-95 transition-all"
        title="Install ParkEasy on home screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="pwa-ios-install-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-[#004D40]/20 bg-white/80 px-3 py-1 text-xs font-medium text-[#004D40] hover:bg-white active:scale-95 transition-all"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Phone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#004D40]/10">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#004D40]/5 p-0.5 flex items-center justify-center">
                    <ParkEasyIcon className="w-full h-full" />
                  </div>
                  <h3 className="font-editorial text-lg font-bold text-[#004D40]">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                1. Tap the <strong className="text-[#004D40]">Share</strong> icon in Safari&#39;s bottom toolbar.<br />
                2. Scroll down and tap <strong className="text-[#004D40]">Add to Home Screen</strong>.<br />
                3. Enjoy instantaneous access to live Abuja parking!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#004D40] py-2.5 text-sm font-semibold text-[#F5F1E8] hover:bg-[#00382E] transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
