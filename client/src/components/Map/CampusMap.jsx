import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import './CampusMap.css';

// Fix default marker icon issue in React-Leaflet
// Without this, markers won't show (known bug)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons by location type
const typeColors = {
  academic: '#1a6b4a',
  hall: '#7c3aed',
  food: '#f59e0b',
  sports: '#ef4444',
  accommodation: '#3b82f6',
  entry: '#10b981',
  parking: '#6b7280',
  administrative: '#8b5cf6',
};

const typeEmojis = {
  academic: '🏫',
  hall: '🏛️',
  food: '🍽️',
  sports: '⚽',
  accommodation: '🏠',
  entry: '🚪',
  parking: '🅿️',
  administrative: '🏢',
};

// Create custom colored marker
function createIcon(type) {
  const color = typeColors[type] || '#1a6b4a';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-pin" style="background-color: ${color}">
        <span class="marker-emoji">${typeEmojis[type] || '📍'}</span>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}

// Component to auto-fit map bounds when locations or route changes
function FitBounds({ locations, route }) {
  const map = useMap();

  useEffect(() => {
    if (route && route.length > 0) {
      // Fit to route path
      const bounds = L.latLngBounds(route.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (locations && locations.length > 0) {
      // Fit to all locations
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [locations, route, map]);

  return null;
}

function CampusMap({ locations, route, selectedLocation }) {
  // Campus center — average of your coordinates
  const center = [12.336, 76.657];

  // Convert route locations to polyline coordinates
  const routeCoords = route ? route.map((loc) => [loc.lat, loc.lng]) : [];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={17}
        className="campus-map"
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds locations={locations} route={route} />

        {/* Location markers */}
        {locations.map((loc) => (
          <Marker
            key={loc._id}
            position={[loc.lat, loc.lng]}
            icon={createIcon(loc.type)}
            opacity={
              selectedLocation
                ? loc._id === selectedLocation._id
                  ? 1
                  : 0.4
                : 1
            }
          >
            <Popup>
              <div className="popup-content">
                <h3>{loc.name}</h3>
                <span className="popup-type">{loc.type}</span>
                {loc.description && <p>{loc.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Route polyline */}
        {routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#1a6b4a',
              weight: 5,
              opacity: 0.8,
              dashArray: '10, 10',
              lineCap: 'round',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default CampusMap;
