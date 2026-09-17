import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ParkingLot } from '../../types';
import { Navigation2, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';

export type ParkingSpotStatus = 'Available' | 'Few Left' | 'Full';

export interface MockParkingSpot {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  status: ParkingSpotStatus;
  hourlyRate: string;
  address?: string;
  district?: string;
}

// Mock parking locations spread across Abuja with district-accurate pricing
export const MOCK_PARKING_SPOTS: MockParkingSpot[] = [
  {
    id: 'spot-wuse2-aminu-kano',
    name: 'Aminu Kano Crescent Strip',
    district: 'Wuse 2',
    coordinates: {
      latitude: 9.0785,
      longitude: 7.4760,
    },
    status: 'Available',
    hourlyRate: '₦500/hr',
    address: 'Plot 142 Aminu Kano Crescent, Wuse 2, Abuja',
  },
  {
    id: 'spot-maitama-hilton',
    name: 'Maitama Park & Go',
    district: 'Maitama',
    coordinates: {
      latitude: 9.0834,
      longitude: 7.4965,
    },
    status: 'Available',
    hourlyRate: '₦800/hr',
    address: '1 Aguiyi Ironsi St (Near Transcorp), Maitama, Abuja',
  },
  {
    id: 'spot-cbd-towers',
    name: 'Central Business District Hub',
    district: 'Central Business District',
    coordinates: {
      latitude: 9.0552,
      longitude: 7.4941,
    },
    status: 'Available',
    hourlyRate: '₦600/hr',
    address: 'Herbert Macaulay Way (Opposite NNPC Towers), CBD, Abuja',
  },
  {
    id: 'spot-jabi-lake',
    name: 'Jabi Lake Mall Parking Deck',
    district: 'Jabi',
    coordinates: {
      latitude: 9.0782,
      longitude: 7.4241,
    },
    status: 'Available',
    hourlyRate: '₦300/hr',
    address: 'Bala Sokoto Way, Jabi Lake, Abuja',
  },
  {
    id: 'spot-wuse2-banex',
    name: 'Banex Plaza Commercial Bay',
    district: 'Wuse 2',
    coordinates: {
      latitude: 9.0864,
      longitude: 7.4725,
    },
    status: 'Full',
    hourlyRate: '₦500/hr',
    address: 'Plot 750 Aminu Kano Way, Wuse 2, Abuja',
  },
  {
    id: 'spot-garki-deck',
    name: 'Area 11 Commercial Deck',
    district: 'Garki',
    coordinates: {
      latitude: 9.0348,
      longitude: 7.4912,
    },
    status: 'Available',
    hourlyRate: '₦400/hr',
    address: 'Moshood Abiola Way, Area 11, Garki, Abuja',
  },
];

interface ParkingMapProps {
  lots?: ParkingLot[];
  parkingSpots?: MockParkingSpot[];
  selectedLot: ParkingLot | null;
  onSelectLot: (lot: ParkingLot) => void;
  userLocation: { lat: number; lng: number };
  onLocateMe: () => void;
  isLocating?: boolean;
}

export const ParkingMap: React.FC<ParkingMapProps> = ({
  lots = [],
  parkingSpots,
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
  const initialGeolocationAttemptedRef = useRef(false);

  // Initialize map and detect user geolocation on load
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Abuja or existing user location
    const defaultLat = userLocation?.lat || 9.0765;
    const defaultLng = userLocation?.lng || 7.4812;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 13,
      zoomControl: false,
    });

    // Carto Voyager detailed modern street map (100% keyless)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Detect user's current location when the app loads and center the map on them
    if (navigator.geolocation && !initialGeolocationAttemptedRef.current) {
      initialGeolocationAttemptedRef.current = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Center the map on user coordinates with zoom level 15
          map.flyTo([lat, lng], 15, { duration: 1.2 });
        },
        (error) => {
          console.warn('Initial geolocation unavailable, keeping default center:', error.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const lastLocationRef = useRef<{ lat: number; lng: number } | null>(null);

  // Update user location marker with modern CSS-based pulsing teal dot
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Modern CSS-based pulsing dot (solid teal #025969 circle with a lighter teal radial pulse animation)
    const userPulsingIcon = L.divIcon({
      className: '',
      html: `
        <div class="user-pulse-marker" style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div class="user-pulse-ring" style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(2, 89, 105, 0.35); animation: userTealPulse 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;"></div>
          <div class="user-pulse-dot" style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #025969; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(2, 89, 105, 0.45);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
      icon: userPulsingIcon,
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindTooltip('Your Location', { direction: 'top', offset: [0, -14] });

    // Center the map on user coordinates with zoom level 15
    if (
      !lastLocationRef.current ||
      lastLocationRef.current.lat !== userLocation.lat ||
      lastLocationRef.current.lng !== userLocation.lng
    ) {
      lastLocationRef.current = userLocation;
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.0 });
    }
  }, [userLocation]);

  // Render Custom Branded Markers and Popups
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.keys(markersRef.current).forEach((id) => {
      const marker = markersRef.current[id];
      if (marker) {
        marker.remove();
      }
    });
    markersRef.current = {};

    // Combine mock data and any lot data provided
    const activeSpots: MockParkingSpot[] = parkingSpots || (() => {
      const spotsMap = new Map<string, MockParkingSpot>();

      // Populate base mock Abuja spots
      MOCK_PARKING_SPOTS.forEach((spot) => {
        spotsMap.set(spot.id, spot);
      });

      // Overlay and merge lots from the store
      lots.forEach((lot) => {
        let derivedStatus: ParkingSpotStatus = 'Available';
        if (lot.open_bays === 0) {
          derivedStatus = 'Full';
        } else if (lot.open_bays <= 3) {
          derivedStatus = 'Few Left';
        }

        const existingKey = Array.from(spotsMap.keys()).find(
          (k) => k === lot.id || spotsMap.get(k)?.name.toLowerCase() === lot.name.toLowerCase()
        );

        const spotObj: MockParkingSpot = {
          id: lot.id,
          name: lot.name,
          coordinates: {
            latitude: lot.lat,
            longitude: lot.lng,
          },
          status: derivedStatus,
          hourlyRate: `₦${lot.price_per_hour}/hr`,
          address: lot.address,
          district: lot.district,
        };

        if (existingKey) {
          spotsMap.set(existingKey, spotObj);
        } else {
          spotsMap.set(lot.id, spotObj);
        }
      });

      return Array.from(spotsMap.values());
    })();

    activeSpots.forEach((spot, index) => {
      const { latitude, longitude } = spot.coordinates;
      const gradId = `parkeasyPinGrad_${spot.id || index}`;

      // Status Indicator: A small circular dot (Green for 'Available', Yellow for 'Few Left', Red for 'Full') next to a text label
      let dotColor = '#16a34a'; // Green for Available
      let statusLabel = 'Available';

      if (spot.status === 'Few Left') {
        dotColor = '#eab308'; // Yellow for Few Left
        statusLabel = 'Few Left';
      } else if (spot.status === 'Full') {
        dotColor = '#dc2626'; // Red for Full
        statusLabel = 'Full';
      }

      // Inline SVG of the Parkeasy brand gradient pin (infinity loop & trapezoid base)
      const pinSvgHtml = `
        <div class="parkeasy-pin-wrapper" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transform-origin: bottom center; transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;">
          <svg viewBox="0 0 100 110" width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; filter: drop-shadow(0 3px 6px rgba(2, 89, 105, 0.45)); overflow: visible;">
            <defs>
              <linearGradient id="${gradId}" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#2D8C3E" />
                <stop offset="100%" stop-color="#C7D810" />
              </linearGradient>
            </defs>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M 50 5 C 28.5 5 11 22.5 11 44 C 11 53.6 14.4 62.4 20.1 69.3 L 9.5 98.6 C 8.2 102.2 10.8 106 14.7 106 L 35.5 106 C 38 106 40.4 104.6 41.6 102.4 L 50 87 L 58.4 102.4 C 59.6 104.6 62 106 64.5 106 L 85.3 106 C 89.2 106 91.8 102.2 90.5 98.6 L 79.9 69.3 C 85.6 62.4 89 53.6 89 44 C 89 22.5 71.5 5 50 5 Z M 50 84 L 63 107 L 37 107 Z M 23 44 C 23 29.1 35.1 17 50 17 C 64.9 17 77 29.1 77 44 C 77 55.4 69.9 65.2 59.8 69.2 L 54.8 59.8 C 61.2 56.6 65.5 50.8 65.5 44 C 65.5 35.4 58.6 28.5 50 28.5 C 41.4 28.5 34.5 35.4 34.5 44 C 34.5 48.2 36.1 52 38.8 54.8 L 30.5 62.5 C 25.8 57.7 23 51.2 23 44 Z M 50 34 C 55.5 34 60 38.5 60 44 C 60 49.5 55.5 54 50 54 C 44.5 54 40 49.5 40 44 C 40 38.5 44.5 34 50 34 Z"
              fill="url(#${gradId})"
            />
          </svg>
        </div>
      `;

      // Custom divIcon with empty className to remove default Leaflet white square styling
      const brandPinIcon = L.divIcon({
        className: '',
        html: pinSvgHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      // Minimalist, high-contrast, modern brand aesthetic popup
      const popupHtml = `
        <div class="parkeasy-popup-card" style="min-width: 190px; font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;">
          <!-- Location Name: Bold, dark grey/black, modern sans-serif -->
          <div style="font-size: 15px; font-weight: 700; color: #1e293b; line-height: 1.3; margin-bottom: 2px;">
            ${spot.name}
          </div>

          <!-- District: Smaller, lighter grey text below the name -->
          <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-bottom: 10px; line-height: 1.3;">
            ${spot.district || spot.address || 'Abuja'}
          </div>

          <!-- Status Indicator and Hourly Rate in brand Teal (#025969) -->
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 8px; margin-top: 4px; gap: 8px;">
            <!-- Status Indicator: A small circular dot (Green, Yellow, Red) next to text label -->
            <div style="display: inline-flex; align-items: center; gap: 6px;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${dotColor}; display: inline-block; flex-shrink: 0;"></span>
              <span style="font-size: 12px; font-weight: 600; color: #334155;">
                ${statusLabel}
              </span>
            </div>

            <!-- Hourly Rate: Prominent text in brand Teal (#025969) -->
            <div style="font-size: 15px; font-weight: 800; color: #025969; letter-spacing: -0.01em;">
              ${spot.hourlyRate}
            </div>
          </div>
        </div>
      `;

      const marker = L.marker([latitude, longitude], { icon: brandPinIcon })
        .addTo(map)
        .bindPopup(popupHtml, {
          closeButton: false,
          offset: [0, -34],
          className: 'parkeasy-brand-popup',
        });

      marker.on('click', () => {
        const matchingLot = lots.find(
          (l) => l.id === spot.id || l.name.toLowerCase() === spot.name.toLowerCase()
        );
        if (matchingLot) {
          onSelectLot(matchingLot);
        }
        map.flyTo([latitude, longitude], 15, { duration: 0.8 });
      });

      markersRef.current[spot.id] = marker;
    });
  }, [lots, parkingSpots, onSelectLot]);

  // Handle selectedLot change from list view or external selection
  useEffect(() => {
    if (selectedLot && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedLot.lat, selectedLot.lng], 15, { duration: 0.8 });
      const marker = markersRef.current[selectedLot.id];
      if (marker) {
        marker.openPopup();
      }
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
      {/* Component Scoped CSS for popup styling and pulsing dot animation */}
      <style>{`
        @keyframes userTealPulse {
          0% {
            transform: scale(0.6);
            opacity: 0.85;
          }
          70% {
            transform: scale(2.2);
            opacity: 0;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        /* Custom Branded Popup styling with 8px rounded corners and subtle shadow */
        .parkeasy-brand-popup .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          border-radius: 8px !important;
          box-shadow: 0 10px 25px -4px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(2, 89, 105, 0.08) !important;
          border: 1px solid rgba(2, 89, 105, 0.1) !important;
          padding: 0 !important;
        }
        .parkeasy-brand-popup .leaflet-popup-content {
          margin: 12px 14px !important;
          line-height: 1.4 !important;
        }
        .parkeasy-brand-popup .leaflet-popup-tip-container {
          overflow: visible !important;
        }
        .parkeasy-brand-popup .leaflet-popup-tip {
          background: #ffffff !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08) !important;
        }
        .parkeasy-pin-wrapper:hover {
          transform: scale(1.15) !important;
        }
      `}</style>

      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          id="map-locate-me-btn"
          onClick={onLocateMe}
          disabled={isLocating}
          title="Find my location in Abuja"
          className="p-2.5 bg-white text-[#025969] rounded-xl shadow-lg border border-[#025969]/10 hover:bg-[#F5F1E8] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
        >
          <Crosshair className={`w-5 h-5 ${isLocating ? 'animate-spin text-[#C7D810]' : ''}`} />
        </button>

        <button
          id="map-recenter-btn"
          onClick={handleRecenterAbuja}
          title="Center on Abuja Central"
          className="p-2.5 bg-white text-[#025969] rounded-xl shadow-lg border border-[#025969]/10 hover:bg-[#F5F1E8] active:scale-95 transition-all flex items-center justify-center"
        >
          <Navigation2 className="w-5 h-5" />
        </button>

        <div className="flex flex-col bg-white rounded-xl shadow-lg border border-[#025969]/10 overflow-hidden mt-1">
          <button
            onClick={handleZoomIn}
            className="p-2 text-[#025969] hover:bg-[#F5F1E8] active:bg-[#C7D810]/30 transition flex items-center justify-center border-b border-gray-100"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-[#025969] hover:bg-[#F5F1E8] active:bg-[#C7D810]/30 transition flex items-center justify-center"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold text-[#1A2E2B] shadow-md border border-[#025969]/10">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2D8C3E]" />
          <span>Available</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span>Few Left</span>
        </div>
        <span className="text-gray-300">•</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
          <span>Full</span>
        </div>
      </div>
    </div>
  );
};
