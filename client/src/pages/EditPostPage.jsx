import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import useApi from '../hooks/useApi';
import { postService } from '../services/api';
import styles from '../components/forms.module.css'; 

const EditPostPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const { data: postResponse, loading: fetchLoading, error: fetchError, execute: fetchPost } = 
    useApi(postService.getPost, { immediate: false });

  const { loading: updateLoading, error: updateError, execute: updatePost } = 
    useApi(postService.updatePost, { immediate: false });

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  const handleSubmit = async (postData) => {

    const { response, error } = await updatePost(postResponse.data._id, postData);
    
    if (!error) {
      const updatedPostSlug = response.data.slug;
      navigate(`/post/${updatedPostSlug}`);
    }
  };

  if (fetchLoading) return <div className={styles.formContainer}>Loading post data...</div>;
  if (fetchError) return <div className={styles.formContainer}><p className={styles.formError}>Error: {fetchError}</p></div>;
  if (!postResponse) return null; // Don't render the form until we have data

  const post = postResponse.data;

  return (

    <div className={styles.formContainer}> 
      <h1 className={styles.formTitle}>Edit Post</h1>
      <PostForm
        post={post} 
        onSubmit={handleSubmit}
        loading={updateLoading}
        error={updateError}
      />
    </div>
  );
};

export default EditPostPage;