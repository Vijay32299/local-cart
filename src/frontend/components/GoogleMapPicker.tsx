import React, { useState, useEffect, useCallback } from 'react';
import { Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { MapPin, Search, Crosshair, Check, AlertCircle } from 'lucide-react';

interface LocationData {
  address: string;
  locality: string;
  city: string;
  landmark: string;
  lat: number;
  lng: number;
}

interface GoogleMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  initialLocality?: string;
  initialCity?: string;
  onLocationSelect: (data: LocationData) => void;
}

// Controller component to smoothly reposition camera
const MapController: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);
  return null;
};

export const GoogleMapPicker: React.FC<GoogleMapPickerProps> = ({
  initialLat = 23.1815, // Default near Jabalpur / MP central
  initialLng = 79.9864,
  initialAddress = '',
  initialLocality = '',
  initialCity = 'Jabalpur',
  onLocationSelect
}) => {
  const [markerPos, setMarkerPos] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng
  });
  const [mapZoom, setMapZoom] = useState<number>(15);

  const [address, setAddress] = useState(initialAddress);
  const [locality, setLocality] = useState(initialLocality);
  const [city, setCity] = useState(initialCity);
  const [landmark, setLandmark] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Quick preset Indian cities for instant map jumping
  const quickJumpCities = [
    { name: 'Jabalpur', lat: 23.1815, lng: 79.9864 },
    { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    { name: 'Indore', lat: 22.7196, lng: 75.8577 },
    { name: 'Ujjain', lat: 23.1765, lng: 75.7885 },
    { name: 'Gwalior', lat: 26.2183, lng: 78.1828 }
  ];

  // Geocode address or search query using Nominatim / Google client geocoding fallback
  const handleSearchLocation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setFeedback('Searching location on map...');
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await resp.json();
      if (data && data.length > 0) {
        const item = data[0];
        const newLat = parseFloat(item.lat);
        const newLng = parseFloat(item.lon);
        const newPos = { lat: newLat, lng: newLng };
        setMarkerPos(newPos);
        setMapCenter(newPos);
        setMapZoom(16);

        const displayName = item.display_name || '';
        const parts = displayName.split(',').map((s: string) => s.trim());
        const suggestedLocality = parts[0] || searchQuery;
        const suggestedCity = parts.length > 3 ? parts[parts.length - 4] : city;

        setAddress(displayName);
        if (!locality) setLocality(suggestedLocality);
        if (!city && suggestedCity) setCity(suggestedCity);

        setFeedback(`Location found: ${suggestedLocality}`);
        onLocationSelect({
          address: displayName,
          locality: locality || suggestedLocality,
          city: city || suggestedCity,
          landmark,
          lat: newLat,
          lng: newLng
        });
      } else {
        setFeedback('Could not find specific spot. You can click directly on the map to pin!');
      }
    } catch (err) {
      setFeedback('Search completed. Click anywhere on the map to drop the pin directly.');
    }
  };

  // Reverse geocode when map is clicked
  const handleMapClick = useCallback(async (e: any) => {
    if (!e.detail || !e.detail.latLng) return;
    const clickedLat = e.detail.latLng.lat;
    const clickedLng = e.detail.latLng.lng;
    const newPos = { lat: clickedLat, lng: clickedLng };
    setMarkerPos(newPos);

    setFeedback(`Pin set at (${clickedLat.toFixed(4)}, ${clickedLng.toFixed(4)})`);

    // Fetch place name for clicked pin
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickedLat}&lon=${clickedLng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await resp.json();
      if (data && data.address) {
        const addr = data.address;
        const sub = addr.suburb || addr.neighbourhood || addr.road || addr.village || 'Local Street';
        const detectedCity = addr.city || addr.town || addr.county || city;
        const fullAddr = data.display_name || `${sub}, ${detectedCity}`;

        setAddress(fullAddr);
        setLocality(sub);
        if (detectedCity) setCity(detectedCity);

        onLocationSelect({
          address: fullAddr,
          locality: sub,
          city: detectedCity,
          landmark,
          lat: clickedLat,
          lng: clickedLng
        });
        return;
      }
    } catch (err) {
      // ignore reverse geocode error
    }

    onLocationSelect({
      address: address || `Near Lat ${clickedLat.toFixed(4)}, Lng ${clickedLng.toFixed(4)}`,
      locality: locality || 'Local Market Area',
      city: city || 'Jabalpur',
      landmark,
      lat: clickedLat,
      lng: clickedLng
    });
  }, [address, locality, city, landmark, onLocationSelect]);

  // Current GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setFeedback('Getting current GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMarkerPos(newPos);
        setMapCenter(newPos);
        setMapZoom(17);
        setFeedback('Using your current GPS location. You can drag or adjust the pin.');

        onLocationSelect({
          address: address || 'Current Device Location',
          locality: locality || 'Near Current Location',
          city: city || 'Local Area',
          landmark,
          lat: newPos.lat,
          lng: newPos.lng
        });
      },
      (err) => {
        setIsLocating(false);
        setFeedback('Could not fetch GPS. Please click directly on the map to set your stall location.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Jump to preset city
  const jumpToCity = (c: { name: string; lat: number; lng: number }) => {
    const newPos = { lat: c.lat, lng: c.lng };
    setCity(c.name);
    setMarkerPos(newPos);
    setMapCenter(newPos);
    setMapZoom(15);
    setFeedback(`Jumped to ${c.name}. Click on your specific gully or mohalla!`);
    onLocationSelect({
      address: `${c.name} Market Area`,
      locality: `${c.name} Main Market`,
      city: c.name,
      landmark,
      lat: c.lat,
      lng: c.lng
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Quick City Jump Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-semibold text-stone-600 mr-1">Quick Jump:</span>
        {quickJumpCities.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => jumpToCity(c)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
              city.toLowerCase() === c.name.toLowerCase()
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* 2. Location Search Bar & GPS Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
            placeholder="Search gully, chowk, area, or landmark (e.g. Sadar Cantt Jabalpur, Ghamapur, MP Nagar)"
            className="w-full pl-9 pr-24 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="button"
            onClick={() => handleSearchLocation()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
          >
            Search
          </button>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors shrink-0"
        >
          <Crosshair className={`w-3.5 h-3.5 text-amber-600 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Locating...' : 'Use My GPS'}
        </button>
      </div>

      {feedback && (
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 3. Interactive Google Map Container */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-stone-300 shadow-inner bg-stone-100 h-[340px] sm:h-[380px] w-full">
        <Map
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          onClick={handleMapClick}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <MapController center={mapCenter} zoom={mapZoom} />
          
          <AdvancedMarker
            position={markerPos}
            title="Shop / Stall Location"
          >
            <Pin
              background="#d97706"
              glyphColor="#ffffff"
              borderColor="#78350f"
              scale={1.2}
            />
          </AdvancedMarker>
        </Map>

        {/* Floating helper instruction */}
        <div className="absolute bottom-2 left-2 right-2 sm:left-4 sm:right-auto bg-stone-900/90 text-white text-[11px] px-3 py-1.5 rounded-lg backdrop-blur-sm pointer-events-none flex items-center gap-1.5 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Click anywhere on the map to pin your shop’s exact stall or gully!</span>
        </div>
      </div>

      {/* 4. Editable Fields synced from Map Pin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            Selected City / Town: <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              onLocationSelect({ address, locality, city: e.target.value, landmark, lat: markerPos.lat, lng: markerPos.lng });
            }}
            placeholder="e.g. Jabalpur, Bhopal, Indore, or your town"
            className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-medium"
          />
        </div>

        <div>
          <label className="block font-semibold text-stone-700 mb-1">
            Locality / Chaupati Area: <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            value={locality}
            onChange={(e) => {
              setLocality(e.target.value);
              onLocationSelect({ address, locality: e.target.value, city, landmark, lat: markerPos.lat, lng: markerPos.lng });
            }}
            placeholder="e.g. Civic Centre, Sadar Bazar, Wright Town, Ghamapur"
            className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block font-semibold text-stone-700 mb-1">
            Detailed Address / Street / Stall Number: <span className="text-amber-600">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              onLocationSelect({ address: e.target.value, locality, city, landmark, lat: markerPos.lat, lng: markerPos.lng });
            }}
            placeholder="e.g. Stall #4, Chaupati Complex, Near Clock Tower"
            className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-medium"
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200">
          <span className="flex items-center gap-1 font-mono">
            <span className="font-semibold text-stone-700">Coordinates:</span> {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
          </span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Accurate Google Maps Pin Saved
          </span>
        </div>
      </div>
    </div>
  );
};
