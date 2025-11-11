import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi.js';
import { categoryService } from '../services/api.js';
import styles from './forms.module.css'; // Import form styles

const PostForm = ({ post, onSubmit, loading, error }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState(null); 

  const { data: categoriesResponse, loading: categoriesLoading } = useApi(
    categoryService.getAllCategories
  );
  const categories = categoriesResponse?.data;

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setCategory(post.category?._id || '');
      setExcerpt(post.excerpt || '');
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('excerpt', excerpt);
    if (image) {
      formData.append('featuredImage', image);
    }
    onSubmit(formData); 
  };
  
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.formError}>{error}</div>}
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.formInput}
        required
      />
      <textarea
        placeholder="Post Content (can be HTML)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        className={styles.formTextarea}
        required
      />
      <textarea
        placeholder="Post Excerpt (optional)"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={3}
        className={styles.formTextarea}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.formSelect}
        required
      >
        <option value="" disabled>Select a category</option>
        {categoriesLoading ? (
          <option disabled>Loading categories...</option>
        ) : (
          categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))
        )}
      </select>
      <div>
        <label>Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className={styles.formInput}
        />
        {post && post.featuredImage && !image && (
           <img 
             src={`${import.meta.env.VITE_API_URL.replace('/api', '')}${post.featuredImage}`} 
             alt={post.title} 
             style={{ width: '100px', marginTop: '10px', borderRadius: '6px' }}
           />
        )}
      </div>
      <button type="submit" disabled={loading || categoriesLoading} className={styles.formButton}>
        {loading ? 'Submitting...' : (post ? 'Update Post' : 'Create Post')}
      </button>
    </form>
  );
};
export default PostForm;