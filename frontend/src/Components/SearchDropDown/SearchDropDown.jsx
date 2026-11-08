import axios from 'axios';
import './SearchDropDown.css';
import React, { useEffect, useRef, useState } from 'react';
import SearchItem from '../SearchItem/SearchItem';
import { API } from '../../backend';

// Live plant search shown in the navigation bar. Results appear as you type.
const SearchDropDown = ({ userId }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const containerRef = useRef(null);
  const latestQuery = useRef('');

  // Close the results when clicking elsewhere.
  useEffect(() => {
    const onPointer = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  const handleChange = async (event) => {
    const value = event.target.value;
    setQuery(value);
    setOpen(true);
    latestQuery.current = value;

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.post(`${API}/api/search`, { query: value });
      // Ignore answers to older keystrokes that arrive late.
      if (latestQuery.current === value) setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const showResults = isOpen && query.trim() !== '';

  return (
    <div className="search-container" ref={containerRef}>
      <i className="bi bi-search search-icon" aria-hidden="true" />
      <input
        type="search"
        className="search-textbox"
        placeholder="Search plants"
        aria-label="Search plants"
        value={query}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }}
      />

      {showResults && (
        <div className="searchallitems" onClick={() => setOpen(false)}>
          {suggestions.length > 0 ? (
            suggestions.map((item) => (
              <SearchItem key={item._id} id={item._id} name={item.name} photo={item.photo} userId={userId} />
            ))
          ) : (
            <p className="search-empty">No plants match “{query}”</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropDown;
