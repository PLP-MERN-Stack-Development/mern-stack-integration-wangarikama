import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import useApi from '../hooks/useApi.js';
import { postService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../components/forms.module.css'; 

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const { loading, error, execute: createPost } = useApi(
    postService.createPost, 
    { immediate: false }
  );

  const handleSubmit = async (postData) => {
    postData.append('author', user._id);
    const { response, error } = await createPost(postData);
    if (!error) {
      const newPostSlug = response.data.slug;
      navigate(`/post/${newPostSlug}`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Create New Post</h1>
      <PostForm 
        onSubmit={handleSubmit} 
        loading={loading} 
        error={error} 
      />
    </div>
  );
};
export default CreatePostPage;