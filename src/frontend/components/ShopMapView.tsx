import React, { useState, useEffect, useMemo } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Shop } from '../../backend/models';
import { useApp } from '../context/AppContext';
import { Star, MapPin, Clock, ArrowRight, Store } from 'lucide-react';

interface ShopMapViewProps {
  shops: Shop[];
  selectedCity: string;
}

const CITY_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
  'All Cities': { lat: 23.2500, lng: 77.4000, zoom: 7 },
  'Indore': { lat: 22.7196, lng: 75.8577, zoom: 13 },
  'Bhopal': { lat: 23.2599, lng: 77.4126, zoom: 13 },
  'Jabalpur': { lat: 23.1815, lng: 79.9864, zoom: 13 },
  'Ujjain': { lat: 23.1765, lng: 75.7885, zoom: 14 },
  'Gwalior': { lat: 26.2183, lng: 78.1828, zoom: 13 }
};

const MapRecenterController: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
};

export const ShopMapView: React.FC<ShopMapViewProps> = ({ shops, selectedCity }) => {
  const { navigateTo } = useApp();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  // Default coordinate based on selected city
  const cityConfig = useMemo(() => {
    return CITY_COORDINATES[selectedCity] || CITY_COORDINATES['All Cities'];
  }, [selectedCity]);

  // Valid shops that have coordinates
  const mappableShops = useMemo(() => {
    return shops.filter((s) => typeof s.lat === 'number' && typeof s.lng === 'number');
  }, [shops]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-stone-200 shadow-lg bg-stone-100">
      <Map
        defaultCenter={cityConfig}
        defaultZoom={cityConfig.zoom}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
        style={{ width: '100%', height: '100%' }}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        <MapRecenterController center={cityConfig} zoom={cityConfig.zoom} />

        {mappableShops.map((shop) => {
          const isChaupati = shop.category === 'chaupati' || shop.category === 'street_food';
          const pinBg = isChaupati ? '#ea580c' : '#d97706';

          return (
            <AdvancedMarker
              key={shop.id}
              position={{ lat: shop.lat!, lng: shop.lng! }}
              title={shop.name}
              onClick={() => setSelectedShop(shop)}
            >
              <Pin
                background={pinBg}
                glyphColor="#ffffff"
                borderColor="#7c2d12"
                scale={selectedShop?.id === shop.id ? 1.3 : 1.0}
              />
            </AdvancedMarker>
          );
        })}

        {selectedShop && selectedShop.lat && selectedShop.lng && (
          <InfoWindow
            position={{ lat: selectedShop.lat, lng: selectedShop.lng }}
            onCloseClick={() => setSelectedShop(null)}
          >
            <div className="p-1 max-w-[260px] text-stone-900 font-sans">
              <div className="relative h-28 w-full rounded-lg overflow-hidden mb-2 bg-stone-100">
                <img
                  src={selectedShop.image}
                  alt={selectedShop.name}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${
                  selectedShop.isOpen ? 'bg-emerald-600' : 'bg-rose-600'
                }`}>
                  {selectedShop.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-0.5">
                {selectedShop.categoryLabel}
              </div>

              <h4 className="text-sm font-bold leading-tight mb-1 text-stone-900">
                {selectedShop.name}
              </h4>

              <p className="text-xs text-stone-600 flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate">{selectedShop.locality}, {selectedShop.city}</span>
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-stone-100 mb-2 text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedShop.rating}</span>
                  <span className="text-[10px] text-stone-400 font-normal">({selectedShop.reviewCount})</span>
                </div>
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{selectedShop.openTime} - {selectedShop.closeTime}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo('shop-details', selectedShop.id)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>View Full Menu & Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Floating map legend / status */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-stone-200 text-xs flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
          <span className="font-medium text-stone-700">Chaupati & Stalls</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
          <span className="font-medium text-stone-700">Heritage Shops</span>
        </div>
        <span className="text-stone-400">|</span>
        <span className="font-bold text-amber-800">{mappableShops.length} mapped in {selectedCity}</span>
      </div>
    </div>
  );
};
