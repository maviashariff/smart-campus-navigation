import { useState } from 'react';
import api from '../../utils/api';
import './NavigationPanel.css';

function NavigationPanel({ locations, onRouteFound, onClearRoute }) {
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNavigate = async () => {
    if (!fromId || !toId) {
      setError('Please select both source and destination');
      return;
    }

    if (fromId === toId) {
      setError('Source and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await api.get(`/navigate?from=${fromId}&to=${toId}`);
      setRouteInfo(data);
      onRouteFound(data.path);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to find route');
      setRouteInfo(null);
      onRouteFound(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFromId('');
    setToId('');
    setRouteInfo(null);
    setError('');
    onClearRoute();
  };

  // Swap source and destination
  const handleSwap = () => {
    setFromId(toId);
    setToId(fromId);
    setRouteInfo(null);
    onClearRoute();
  };

  // Estimate walking time (avg human walking speed ~80m/min)
  const estimateTime = (meters) => {
    const minutes = Math.ceil(meters / 80);
    return minutes <= 1 ? '~1 min' : `~${minutes} mins`;
  };

  return (
    <div className="nav-panel">
      <h3 className="nav-panel-title">🧭 Navigate</h3>

      <div className="nav-inputs">
        <div className="nav-field">
          <label>From</label>
          <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
            <option value="">Select starting point</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        <button className="swap-btn" onClick={handleSwap} title="Swap locations">
          ⇅
        </button>

        <div className="nav-field">
          <label>To</label>
          <select value={toId} onChange={(e) => setToId(e.target.value)}>
            <option value="">Select destination</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="nav-error">{error}</div>}

      <div className="nav-actions">
        <button
          className="nav-btn nav-btn-primary"
          onClick={handleNavigate}
          disabled={loading}
        >
          {loading ? 'Finding route...' : 'Find Route'}
        </button>
        {routeInfo && (
          <button className="nav-btn nav-btn-secondary" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {/* Route result */}
      {routeInfo && (
        <div className="nav-result">
          <div className="nav-result-header">
            <div className="nav-stat">
              <span className="nav-stat-value">{routeInfo.distance}m</span>
              <span className="nav-stat-label">Distance</span>
            </div>
            <div className="nav-stat">
              <span className="nav-stat-value">{estimateTime(routeInfo.distance)}</span>
              <span className="nav-stat-label">Walking</span>
            </div>
          </div>

          <div className="nav-route-steps">
            <h4>Route:</h4>
            {routeInfo.path.map((loc, idx) => (
              <div key={loc._id} className="route-step">
                <div className="step-dot">
                  {idx === 0 ? '🟢' : idx === routeInfo.path.length - 1 ? '🔴' : '⚪'}
                </div>
                <div className="step-info">
                  <span className="step-name">{loc.name}</span>
                  <span className="step-type">{loc.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavigationPanel;
