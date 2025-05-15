'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';
import { useState, useEffect } from 'react';

// Create custom marker icons
const createIcon = (selected) => {
  return L.divIcon({
    className: selected ? styles.selectedMarker : styles.marker,
    html: `<div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${selected ? '#3b82f6' : '#6b7280'}" stroke="${selected ? '#fff' : '#fff'}" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    </div>`,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
};

export default function MapComponent({ cities, onCitySelect, selectedCities }) {
  const center = [36.8065, 10.1815]; // Center on Tunis
  const [mapRef, setMapRef] = useState(null);
  
  // Fix for icon paths
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  return (
    <div className={styles.mapWrapper}>
      
      <div className={styles.mapContainer}>
        <MapContainer 
          center={center} 
          zoom={7} 
          className={styles.map} 
          ref={setMapRef}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={19}
          />
          <ZoomControl position="bottomright" />
          {cities.map((city) => {
            const isSelected = selectedCities.some(c => c.name === city.name);
            return (
              <Marker
                key={city.name}
                position={[city.lat, city.lng]}
                icon={createIcon(isSelected)}
                eventHandlers={{
                  click: () => onCitySelect(city),
                }}
              >
                <Popup className={styles.customPopup}>
                  <div className={styles.popupContent}>
                    <h3>{city.name}</h3>
                    <div className={styles.popupDetails}>
                      <div className={styles.popupItem}>
                        <span className={styles.popupLabel}>Factory Cost:</span>
                        <span>{city.cout_usine.toLocaleString()} TND</span>
                      </div>
                      <div className={styles.popupItem}>
                        <span className={styles.popupLabel}>Warehouse Cost:</span>
                        <span>{city.cout_entrepot.toLocaleString()} TND</span>
                      </div>
                    </div>
                    <button 
                      className={isSelected ? styles.popupButtonSelected : styles.popupButton}
                      onClick={() => onCitySelect(city)}
                    >
                      {isSelected ? 'Selected' : 'Select City'}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}