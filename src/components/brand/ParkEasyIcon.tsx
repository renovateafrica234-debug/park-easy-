import React from 'react';

interface ParkEasyIconProps {
  className?: string;
  size?: number;
}

export const ParkEasyIcon: React.FC<ParkEasyIconProps> = ({ className = 'w-8 h-8', size }) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="Parkeasy Icon"
    >
      <defs>
        <linearGradient id="parkeasyBrandGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D8C3E" />
          <stop offset="100%" stopColor="#C7D810" />
        </linearGradient>
      </defs>

      {/* Stylized location pin with infinity loop and trapezoid base */}
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
        fill="url(#parkeasyBrandGrad)"
      />
    </svg>
  );
};
