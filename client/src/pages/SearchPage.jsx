import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postService } from '../services/api';
import useApi from '../hooks/useApi';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const apiUrlBase = import.meta.env.VITE_API_URL.replace('/api', '');

  const { data: posts, loading, error, execute: search } = useApi(
    postService.searchPosts, { immediate: false }
  );

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);
  
  if (loading) return <div className="container mx-auto px-4 py-8">Searching...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      {posts && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
             <article key={post._id} className="bg-white p-6 rounded-lg shadow-md flex gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">
                  <Link to={`/post/${post.slug || post._id}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-700 mb-4">{post.excerpt}</p>
                <small className="text-gray-500">
                  By {post.author?.username || 'Unknown'} in {post.category?.name || 'Uncategorized'}
                </small>
              </div>
              {post.featuredImage && (
                <img 
                  src={`${apiUrlBase}${post.featuredImage}`} 
                  alt={post.title} 
                  className="w-48 h-32 object-cover rounded-md"
                />
              )}
            </article>
          ))}
        </div>
      ) : (
        <p>No posts found matching your search.</p>
      )}
    </div>
  );
};

export default SearchPage;