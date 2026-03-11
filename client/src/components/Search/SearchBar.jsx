import { useState } from 'react';
import './SearchBar.css';

function SearchBar({ locations, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value) => {
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Client-side filtering — faster than API call for small dataset
    const filtered = locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(value.toLowerCase()) ||
        loc.description.toLowerCase().includes(value.toLowerCase()) ||
        loc.type.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(true);
  };

  const handleSelect = (location) => {
    setQuery(location.name);
    setIsOpen(false);
    onSelect(location);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onSelect(null);
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search buildings, departments, facilities..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="search-input"
        />
        {query && (
          <button className="search-clear" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="search-results">
          {results.map((loc) => (
            <li
              key={loc._id}
              className="search-result-item"
              onClick={() => handleSelect(loc)}
            >
              <div className="result-info">
                <span className="result-name">{loc.name}</span>
                <span className="result-desc">{loc.description}</span>
              </div>
              <span className="result-type">{loc.type}</span>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="search-no-results">No locations found</div>
      )}
    </div>
  );
}

export default SearchBar;
