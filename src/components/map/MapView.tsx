import React, { useEffect, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../../context/AppContext';
import LocationPicker from './LocationPicker';

function createMarkerIcon(selected: boolean = false): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `
      <div class="marker-wrapper" style="position:relative;width:30px;height:30px;">
        <div class="marker-bounce" style="
          width:26px;height:26px;border-radius:50%;
          background:linear-gradient(135deg,#3b82f6,#1e40af);
          box-shadow:0 3px 8px rgba(0,0,0,0.35), 0 0 0 2px #fff;
          transition:transform 0.2s;
        "></div>
        ${selected ? '<div class="pulse-ring" style="position:absolute;top:-4px;left:-4px;width:34px;height:34px;border-radius:50%;border:3px solid #3b82f6;animation:pulse 1.5s ease-out infinite;"></div>' : ''}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

const style = document.createElement('style');
style.textContent = `
  @keyframes markerBounce {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.25); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes pulse {
    0% { transform: scale(0.8); opacity: 0.6; }
    50% { transform: scale(1.3); opacity: 0.2; }
    100% { transform: scale(0.8); opacity: 0.6; }
  }
  .marker-bounce { animation: markerBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
  .leaflet-control-zoom a {
    background: rgba(255,255,255,0.9) !important;
    backdrop-filter: blur(8px);
    color: #1f2937 !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    width: 36px !important; height: 36px !important; line-height: 36px !important;
    font-size: 18px !important; font-weight: 600;
    transition: background 0.2s;
  }
  .leaflet-control-zoom a:hover { background: rgba(255,255,255,1) !important; }
  .leaflet-control-zoom { border: none !important; box-shadow: none !important; }
  .leaflet-control-zoom.leaflet-bar { border-radius: 10px !important; overflow: hidden; }
  .leaflet-container { font-family: inherit; }
`;
document.head.appendChild(style);

function MapController() {
  const map = useMap();
  const { mapCenter, selectedListing, selectedLocation } = useApp();

  useEffect(() => {
    if (selectedListing && !selectedLocation) {
      map.flyTo([selectedListing.lat, selectedListing.lng], 14, { duration: 1 });
    } else if (selectedLocation) {
      map.flyTo(selectedLocation, 14, { duration: 1 });
    }
  }, [map, selectedListing?.id, selectedLocation]);

  useEffect(() => {
    if (!selectedListing && !selectedLocation) {
      map.flyTo(mapCenter, map.getZoom(), { duration: 0.8 });
    }
  }, [map, mapCenter]);

  return null;
}

function LocateMe() {
  const map = useMap();

  const handleLocate = useCallback(() => {
    map.locate({ setView: false });
    map.once('locationfound', (e) => {
      map.flyTo(e.latlng, 15, { duration: 1 });
    });
  }, [map]);

  return (
    <button
      onClick={handleLocate}
      className="absolute bottom-6 right-6 z-[1000] w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center hover:bg-white transition-colors border border-gray-200"
      aria-label="Locate me"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
      </svg>
    </button>
  );
}

export default function MapView() {
  const { listings, mapCenter, selectedLocation, setSelectedLocation } = useApp();

  const markers = useMemo(
    () =>
      listings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.lat, listing.lng]}
          icon={createMarkerIcon(false)}
        >
          <Popup>
            <div className="font-semibold text-sm">{listing.title}</div>
            <div className="text-xs text-gray-500">${listing.price}/hr</div>
          </Popup>
        </Marker>
      )),
    [listings]
  );

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={12}
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ background: '#e8f4f8' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="topright" />
        <MapController />
        {markers}
        <LocationPicker position={selectedLocation} onLocationSelect={setSelectedLocation} />
        <LocateMe />
      </MapContainer>
    </div>
  );
}
