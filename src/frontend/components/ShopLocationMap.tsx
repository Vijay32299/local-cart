import React from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Shop } from '../../backend/models';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface ShopLocationMapProps {
  shop: Shop;
}

export const ShopLocationMap: React.FC<ShopLocationMapProps> = ({ shop }) => {
  const defaultPos = {
    lat: shop.lat || 23.1815,
    lng: shop.lng || 79.9864
  };

  const googleMapsDirectionsUrl = shop.googleMapsUrl || 
    `https://www.google.com/maps/dir/?api=1&destination=${defaultPos.lat},${defaultPos.lng}&destination_place_id=${encodeURIComponent(shop.name)}`;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Exact Location & Google Maps</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {shop.stallNumber ? `${shop.stallNumber}, ` : ''}{shop.locality}, {shop.city}
          </p>
        </div>

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-amber-700" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 text-amber-500" />
        </a>
      </div>

      {/* Embedded interactive Google Map */}
      <div className="relative h-[240px] sm:h-[280px] w-full bg-stone-100">
        <Map
          defaultCenter={defaultPos}
          defaultZoom={15}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <AdvancedMarker
            position={defaultPos}
            title={shop.name}
          >
            <Pin
              background="#d97706"
              glyphColor="#ffffff"
              borderColor="#78350f"
              scale={1.2}
            />
          </AdvancedMarker>
        </Map>
      </div>

      <div className="p-3.5 bg-stone-50/80 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-stone-800">Landmark:</span>
          <span>{shop.landmark || 'Prominent central location in local market'}</span>
        </div>
        <div className="text-[11px] text-stone-500 font-mono">
          Lat: {defaultPos.lat.toFixed(4)}, Lng: {defaultPos.lng.toFixed(4)}
        </div>
      </div>
    </div>
  );
};
