import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ParkingLot } from '../../types';
import { Navigation2, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';

interface ParkingMapProps {
  lots: ParkingLot[];
  selectedLot: ParkingLot | null;
  onSelectLot: (lot: ParkingLot) => void;
  userLocation: { lat: number; lng: number };
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  lots,
  selectedLot,
  onSelectLot,
  userLocation,
  onLocateMe,
  isLocating = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Abuja (9.0765, 7.3986)
    const map = L.map(mapContainerRef.current, {
      center: [9.0765, 7.4812],
      zoom: 13,
      zoomControl: false,
    });

    // CartoDB Positron (light) public basemap CDN (keyless)
    const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    });

    // Fallback gracefully to standard OpenStreetMap if any tile loading issues occur
    cartoLayer.on('tileerror', () => {
      console.warn('Carto tile load failure detected. Falling back to OpenStreetMap standard tiles.');
      cartoLayer.remove();
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
    });

    cartoLayer.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px;">
          <div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(0, 77, 64, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 20px; height: 20px; margin: 4px; border-radius: 9999px; background: #004D40; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
      .addTo(map)
      .bindTooltip('Your Location in Abuja', { direction: 'top', offset: [0, -10] });
  }, [userLocation]);

  // Update lot markers when lots change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.keys(markersRef.current).forEach((id) => {
      const marker = markersRef.current[id];
      if (marker) {
        marker.remove();
      }
    });
    markersRef.current = {};

    lots.forEach((lot) => {
      const isOpen = lot.open_bays > 0;
      const isLow = lot.open_bays > 0 && lot.open_bays <= 3;
      const isSelected = selectedLot?.id === lot.id;

      // Color scheme based on availability
      let bgColor = '#004D40'; // Deep teal
      let textColor = '#F5F1E8';
      let badgeColor = '#D4E157'; // Lemon
      let badgeText = '#004D40';

      if (!isOpen) {
        bgColor = '#B91C1C'; // Red full
        textColor = '#FFFFFF';
        badgeColor = '#FEE2E2';
        badgeText = '#991B1B';
      } else if (isLow) {
        bgColor = '#D97706'; // Amber low
        textColor = '#FFFFFF';
        badgeColor = '#FEF3C7';
        badgeText = '#92400E';
      }

      const customIcon = L.divIcon({
        className: 'parking-lot-marker',
        html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            background: ${bgColor};
            color: ${textColor};
            border: 2px solid ${isSelected ? '#D4E157' : '#FFFFFF'};
            border-radius: 9999px;
            box-shadow: 0 8px 18px rgba(0, 77, 64, ${isSelected ? '0.45' : '0.25'});
            transform: ${isSelected ? 'scale(1.12)' : 'scale(1)'};
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer;
            white-space: nowrap;
          ">
            <span style="font-weight: 800; font-size: 13px; font-family: 'Fraunces', serif;">₦${lot.price_per_hour}</span>
            <span style="
              background: ${badgeColor};
              color: ${badgeText};
              font-size: 11px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 9999px;
              display: inline-flex;
              align-items: center;
            ">
              ${isOpen ? `${lot.open_bays} free` : 'FULL'}
            </span>
          </div>
        `,
        iconSize: [110, 36],
        iconAnchor: [55, 18],
      });

      const marker = L.marker([lot.lat, lot.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        onSelectLot(lot);
        map.flyTo([lot.lat, lot.lng], 15, { duration: 0.8 });
      });

      markersRef.current[lot.id] = marker;
    });
  }, [lots, selectedLot, onSelectLot]);

  // Handle selectedLot change from list view
  useEffect(() => {
    if (selectedLot && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedLot.lat, selectedLot.lng], 15, { duration: 0.8 });
    }
  }, [selectedLot]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenterAbuja = () => {
    mapInstanceRef.current?.flyTo([9.0765, 7.4812], 13, { duration: 0.8 });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#E5DFD3] rounded-2xl overflow-hidden shadow-inner border border-[#004D40]/10">
      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          id="map-locate-me-btn"
          onClick={onLocateMe}
          disabled={isLocating}
          title="Find my location in Abuja"
          className="p-2.5 bg-white text-[#004D40] rounded-xl shadow-lg border border-[#004D40]/10 hover:bg-[#F5F1E8] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
        >
          <Crosshair className={`w-5 h-5 ${isLocating ? 'animate-spin text-[#D4E157]' : ''}`} />
        </button>

        <button
          id="map-recenter-btn"
          onClick={handleRecenterAbuja}
          title="Center on Abuja Central"
          className="p-2.5 bg-white text-[#004D40] rounded-xl shadow-lg border border-[#004D40]/10 hover:bg-[#F5F1E8] active:scale-95 transition-all flex items-center justify-center"
        >
          <Navigation2 className="w-5 h-5" />
        </button>

        <div className="flex flex-col bg-white rounded-xl shadow-lg border border-[#004D40]/10 overflow-hidden mt-1">
          <button
            onClick={handleZoomIn}
            className="p-2 text-[#004D40] hover:bg-[#F5F1E8] active:bg-[#D4E157]/30 transition flex items-center justify-center border-b border-gray-100"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-[#004D40] hover:bg-[#F5F1E8] active:bg-[#D4E157]/30 transition flex items-center justify-center"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1A2E2B] shadow-md border border-[#004D40]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#004D40]" />
          <span>Available</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span>Few Left</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C]" />
          <span>Full</span>
        </div>
      </div>
    </div>
  );
};
