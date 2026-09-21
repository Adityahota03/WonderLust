import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Hotel, Plane, MapPin, ExternalLink, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet's default icon path issues in bundled environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to auto-recenter map when items change
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Custom SVG Icons for Hotels, Tickets, and Guides
const createCustomIcon = (type, price) => {
  let bgColor = '#2563eb'; // blue for hotels
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57a2 2 0 0 1 .45-1.25L12 12l1.55 2.18a2 2 0 0 1 .45 1.25V22"/><path d="M18 2H6a2 2 0 0 0-2 2v18h16V4a2 2 0 0 0-2-2z"/><path d="M9 6h6"/><path d="M9 10h6"/></svg>`;

  if (type === 'ticket') {
    bgColor = '#059669'; // emerald for transport
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`;
  } else if (type === 'guide') {
    bgColor = '#7c3aed'; // violet for guides
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/></svg>`;
  }

  const priceBadge = price ? `<span style="font-size:11px;font-weight:700;margin-left:3px;">$${price}</span>` : '';

  const html = `
    <div style="
      background-color: ${bgColor};
      color: white;
      padding: 5px 8px;
      border-radius: 9999px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      border: 2px solid white;
      display: flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;
      cursor: pointer;
      transform: translate(-50%, -50%);
      transition: transform 0.2s ease;
    ">
      ${iconSvg}
      ${priceBadge}
    </div>
  `;

  return L.divIcon({
    html: html,
    className: 'custom-map-pin',
    iconSize: [60, 30],
    iconAnchor: [30, 15],
    popupAnchor: [0, -20],
  });
};

const MapView = ({ items = [], activeItem = null, onItemSelect = null, defaultCenter = [48.8566, 2.3522], defaultZoom = 12 }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);

  useEffect(() => {
    // If there are items with valid coordinates, calculate mean center
    const validItems = items.filter((item) => (item.lat || item.lat_destination) && (item.lng || item.lng_destination));
    if (validItems.length > 0) {
      if (activeItem && activeItem.lat && activeItem.lng) {
        setCenter([activeItem.lat, activeItem.lng]);
        setZoom(14);
      } else {
        const item = validItems[0];
        const lat = item.lat || item.lat_destination;
        const lng = item.lng || item.lng_destination;
        setCenter([lat, lng]);
        setZoom(validItems.length === 1 ? 13 : 11);
      }
    }
  }, [items, activeItem]);

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {items.map((item) => {
          const lat = item.lat || item.lat_destination;
          const lng = item.lng || item.lng_destination;
          if (!lat || !lng) return null;

          const itemType = item.transport_type ? 'ticket' : item.daily_rate ? 'guide' : 'hotel';
          const price = item.starting_price || item.price || item.daily_rate;

          return (
            <Marker
              key={`${itemType}-${item.id}`}
              position={[lat, lng]}
              icon={createCustomIcon(itemType, price)}
              eventHandlers={{
                click: () => onItemSelect && onItemSelect(item),
              }}
            >
              <Popup className="travel-map-popup">
                <div className="w-64 bg-white rounded-2xl overflow-hidden text-slate-800">
                  {/* Image */}
                  <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={item.image_url || item.photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                      alt={item.name || item.carrier}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm uppercase">
                      {itemType}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {item.name || `${item.carrier} ${item.carrier_code}`}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-500 truncate mb-2">
                      {item.address || item.destination_city || item.destination_name || 'Prime Location'}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xs text-slate-400">from </span>
                        <span className="text-base font-extrabold text-brand-600">
                          ${price}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {itemType === 'hotel' ? '/nt' : itemType === 'guide' ? '/day' : ''}
                        </span>
                      </div>

                      {itemType === 'hotel' ? (
                        <Link
                          to={`/hotels/${item.id}`}
                          className="px-2.5 py-1 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center gap-1 transition-colors"
                        >
                          Details <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => onItemSelect && onItemSelect(item)}
                          className="px-2.5 py-1 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center gap-1 transition-colors"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
