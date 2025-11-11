import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';
import useApi from '../hooks/useApi';
import { useAuth } from '../context/AuthContext.jsx'; 

const PostPage = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);
  const apiUrlBase = import.meta.env.VITE_API_URL.replace('/api', '');

  // 1. Rename 'post' to 'response'
  const { data: response, loading, error, execute: fetchPost } = useApi(
    postService.getPost, { immediate: false }
  );
  
  const { loading: commentLoading, error: commentError, execute: addComment } = useApi(
    postService.addComment, { immediate: false }
  );

  useEffect(() => {
    if (id) fetchPost(id);
  }, [id, fetchPost]);
  
  // 2. Extract 'data' from the response
  useEffect(() => {
    if(response) setComments(response.data.comments || []);
  }, [response]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const { response: commentResponse, error } = await addComment(response.data._id, { content: commentContent });
    if (!error) {
      setComments([...comments, commentResponse.data]); 
      setCommentContent('');
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading post...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-600">Error: {error}</div>;
  if (!response) return <div className="container mx-auto px-4 py-8">Post not found.</div>;
  
  const post = response.data;

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      {}
      {post.featuredImage && (
        <img 
          src={`${apiUrlBase}${post.featuredImage}`} 
          alt={post.title} 
          className="w-full h-96 object-cover rounded-lg mb-6"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-500 mb-6">
        By {post.author?.username || 'Unknown'} in 
        <Link to={`/category/${post.category?.slug || post.category?._id}`} className="text-blue-600">
          {post.category?.name || 'Uncategorized'}
        </Link>
        on {new Date(post.createdAt).toLocaleDateString()}
      </div>
      
      <div 
        className="prose max-w-none" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <hr className="my-8" />

      <section className="comments">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              rows="3"
              placeholder="Add your comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {commentError && <div className="text-red-600 mt-2">{commentError}</div>}
            <button type="submit" disabled={commentLoading} className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
              {commentLoading ? 'Submitting...' : 'Submit Comment'}
            </button>
          </form>
        ) : (
          <p>You must be <Link to="/login" className="text-blue-600">logged in</Link> to comment.</p>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="bg-gray-100 p-4 rounded-lg">
                <p>{comment.content}</p>
                <small className="text-gray-600">
                  By {comment.user?.username || 'Unknown'} on {new Date(comment.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </section>
    </article>
  );
};

export default PostPage;