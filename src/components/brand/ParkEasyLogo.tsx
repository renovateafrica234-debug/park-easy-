import React from 'react';
import { ParkEasyIcon } from './ParkEasyIcon';

interface ParkEasyLogoProps {
  className?: string;
  iconClassName?: string;
}

export const ParkEasyLogo: React.FC<ParkEasyLogoProps> = ({
  className = '',
  iconClassName = 'h-8 sm:h-9 md:h-10 w-auto max-h-[42px]',
}) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-2.5 select-none max-h-[45px] ${className}`}
    >
      {/* Official Stylized Pin Icon */}
      <ParkEasyIcon className={iconClassName} />

      {/* Wordmark Lockup: Teal (#025969) + Lemon (#C7D810) */}
      <div className="flex items-center leading-none">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans flex items-baseline">
          <span style={{ color: '#025969' }}>Park</span>
          <span style={{ color: '#C7D810' }}>easy</span>
        </span>
      </div>
    </div>
  );
};
