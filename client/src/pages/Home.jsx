import { useState, useEffect } from 'react';
import api from '../utils/api';
import CampusMap from '../components/Map/CampusMap';
import SearchBar from '../components/Search/SearchBar';
import NavigationPanel from '../components/Navigation/NavigationPanel';
import './Home.css';

function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all locations on page load
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get('/locations');
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleSearchSelect = (location) => {
    setSelectedLocation(location);
    setRoute(null); // Clear any existing route when searching
  };

  const handleRouteFound = (pathLocations) => {
    setRoute(pathLocations);
    setSelectedLocation(null); // Clear search highlight when navigating
  };

  const handleClearRoute = () => {
    setRoute(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading campus map...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-section">
          <h3 className="sidebar-title">🔍 Search</h3>
          <SearchBar locations={locations} onSelect={handleSearchSelect} />
        </div>

        <NavigationPanel
          locations={locations}
          onRouteFound={handleRouteFound}
          onClearRoute={handleClearRoute}
        />

        {/* Location stats */}
        <div className="campus-stats">
          <h4>Campus Overview</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{locations.length}</span>
              <span className="stat-label">Locations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {[...new Set(locations.map((l) => l.type))].length}
              </span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>

        {/* Developer credit */}
        <div className="sidebar-credit">
          Developed by <strong>Sheikh Jaan</strong> · St. Philomena's College
        </div>
      </aside>

      {/* Map area */}
      <main className="map-area">
        <CampusMap
          locations={locations}
          route={route}
          selectedLocation={selectedLocation}
        />
      </main>
    </div>
  );
}

export default Home;
