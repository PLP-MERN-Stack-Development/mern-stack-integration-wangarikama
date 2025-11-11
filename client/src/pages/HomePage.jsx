import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';
import useApi from '../hooks/useApi';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const [page, setPage] = useState(1);

  const { data, loading, error, execute: fetchPosts } = useApi(
    postService.getAllPosts,
    { immediate: false }
  );
  
  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); 
  };

  if (loading && !data) return <div className="container mx-auto px-4 py-8">Loading posts...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  if (!data || data.data.length === 0) return <div className="container mx-auto px-4 py-8">No posts found.</div>;

  const posts = data.data;
  const pagination = data.pagination;
  const apiUrlBase = import.meta.env.VITE_API_URL.replace('/api', '');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blog Posts</h1>
      {loading && <div className="text-center my-4">Loading new page...</div>} 
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

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export default HomePage;