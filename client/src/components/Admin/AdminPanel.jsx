import { useState, useEffect } from 'react';
import api from '../../utils/api';
import './Admin.css';

function AdminPanel({ admin, onLogout }) {
  const [locations, setLocations] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activeTab, setActiveTab] = useState('locations');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Location form state
  const [form, setForm] = useState({
    name: '', type: 'academic', lat: '', lng: '', description: '',
  });

  // Edge form state
  const [edgeForm, setEdgeForm] = useState({ from: '', to: '' });

  const locationTypes = [
    'academic', 'hall', 'food', 'sports', 'accommodation', 'entry', 'parking', 'administrative',
  ];

  // Fetch data on mount
  useEffect(() => {
    fetchLocations();
    fetchEdges();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data } = await api.get('/locations');
      setLocations(data);
    } catch (err) {
      showMessage('error', 'Failed to fetch locations');
    }
  };

  const fetchEdges = async () => {
    try {
      const { data } = await api.get('/edges');
      setEdges(data);
    } catch (err) {
      showMessage('error', 'Failed to fetch edges');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // ===== LOCATION CRUD =====

  const handleLocationSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/locations/${editingId}`, form);
        showMessage('success', 'Location updated successfully');
      } else {
        await api.post('/locations', form);
        showMessage('success', 'Location added successfully');
      }
      resetForm();
      fetchLocations();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (loc) => {
    setForm({
      name: loc.name,
      type: loc.type,
      lat: loc.lat,
      lng: loc.lng,
      description: loc.description || '',
    });
    setEditingId(loc._id);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      await api.delete(`/locations/${id}`);
      showMessage('success', 'Location deleted');
      fetchLocations();
    } catch (err) {
      showMessage('error', 'Failed to delete location');
    }
  };

  // ===== EDGE CRUD =====

  const handleEdgeSubmit = async (e) => {
    e.preventDefault();

    if (edgeForm.from === edgeForm.to) {
      showMessage('error', 'Cannot connect a location to itself');
      return;
    }

    try {
      // Auto-calculate distance using the locations' coordinates
      const fromLoc = locations.find((l) => l._id === edgeForm.from);
      const toLoc = locations.find((l) => l._id === edgeForm.to);

      if (!fromLoc || !toLoc) {
        showMessage('error', 'Invalid locations selected');
        return;
      }

      // Haversine calculation on client side
      const R = 6371000;
      const toRad = (deg) => (deg * Math.PI) / 180;
      const dLat = toRad(toLoc.lat - fromLoc.lat);
      const dLng = toRad(toLoc.lng - fromLoc.lng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(fromLoc.lat)) * Math.cos(toRad(toLoc.lat)) *
        Math.sin(dLng / 2) ** 2;
      const distance = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

      await api.post('/edges', { from: edgeForm.from, to: edgeForm.to, distance });
      showMessage('success', `Path added (${distance}m)`);
      setEdgeForm({ from: '', to: '' });
      fetchEdges();
    } catch (err) {
      showMessage('error', err.response?.data?.message || 'Failed to add path');
    }
  };

  const handleDeleteEdge = async (id) => {
    if (!window.confirm('Delete this path connection?')) return;

    try {
      await api.delete(`/edges/${id}`);
      showMessage('success', 'Path deleted');
      fetchEdges();
    } catch (err) {
      showMessage('error', 'Failed to delete path');
    }
  };

  const resetForm = () => {
    setForm({ name: '', type: 'academic', lat: '', lng: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onLogout();
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="admin-welcome">Welcome, {admin.username}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Status message */}
      {message.text && (
        <div className={`admin-message ${message.type}`}>{message.text}</div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          📍 Locations ({locations.length})
        </button>
        <button
          className={`tab ${activeTab === 'edges' ? 'active' : ''}`}
          onClick={() => setActiveTab('edges')}
        >
          🔗 Paths ({edges.length})
        </button>
      </div>

      {/* ===== LOCATIONS TAB ===== */}
      {activeTab === 'locations' && (
        <div className="tab-content">
          <button className="add-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Location'}
          </button>

          {showForm && (
            <form className="admin-form" onSubmit={handleLocationSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Science Block"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    {locationTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                    placeholder="e.g. 12.3345"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                    placeholder="e.g. 76.6570"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional description"
                />
              </div>

              <button type="submit" className="submit-btn">
                {editingId ? 'Update Location' : 'Add Location'}
              </button>
            </form>
          )}

          {/* Locations table */}
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Coordinates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc._id}>
                    <td>
                      <strong>{loc.name}</strong>
                      {loc.description && (
                        <span className="table-desc">{loc.description}</span>
                      )}
                    </td>
                    <td><span className="type-badge">{loc.type}</span></td>
                    <td className="coords">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</td>
                    <td>
                      <div className="action-btns">
                        <button className="edit-btn" onClick={() => handleEdit(loc)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(loc._id, loc.name)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== EDGES TAB ===== */}
      {activeTab === 'edges' && (
        <div className="tab-content">
          <form className="admin-form edge-form" onSubmit={handleEdgeSubmit}>
            <h4>Add New Path</h4>
            <div className="form-row">
              <div className="form-group">
                <label>From</label>
                <select
                  value={edgeForm.from}
                  onChange={(e) => setEdgeForm({ ...edgeForm, from: e.target.value })}
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>To</label>
                <select
                  value={edgeForm.to}
                  onChange={(e) => setEdgeForm({ ...edgeForm, to: e.target.value })}
                  required
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc._id} value={loc._id}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="submit" className="submit-btn">Add Path</button>
          </form>

          {/* Edges table */}
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Distance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {edges.map((edge) => (
                  <tr key={edge._id}>
                    <td><strong>{edge.from?.name || 'Unknown'}</strong></td>
                    <td><strong>{edge.to?.name || 'Unknown'}</strong></td>
                    <td>{edge.distance}m</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteEdge(edge._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
