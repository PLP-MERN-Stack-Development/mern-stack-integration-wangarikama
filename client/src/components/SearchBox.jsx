import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded-r-md hover:bg-blue-600">
        Search
      </button>
    </form>
  );
};

export default SearchBox;