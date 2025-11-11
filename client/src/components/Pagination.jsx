import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (totalPages <= 1) {
    return null; 
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex gap-2 justify-center mt-8">
      <button 
        onClick={() => handlePageClick(page - 1)} 
        disabled={page === 1}
        className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => handlePageClick(number)}
          className={`px-3 py-1 border border-gray-300 rounded ${
            number === page ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
        >
          {number}
        </button>
      ))}

      <button 
        onClick={() => handlePageClick(page + 1)} 
        disabled={page === totalPages}
        className="px-3 py-1 bg-white border border-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;