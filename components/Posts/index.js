import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const maxPosts = 50; 

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [morePosts, setMorePosts] = useState(true);

  const { isSmallerDevice } = useWindowWidth(); 

  const fetchPosts = async (start, limit) => {
    setIsLoading(true);

    try {
      const { data: post } = await axios.get('/api/v1/posts', {
        params: { start, limit },
      });


      if (post.length > 0) {
        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts, ...post];
          
 
          if (updatedPosts.length >= maxPosts) {
            setMorePosts(false);
          }
          
          return updatedPosts;
        });
      } else {
        setMorePosts(false); 
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialLimit = isSmallerDevice ? 5 : 10;
    fetchPosts(0, initialLimit);
  }, [isSmallerDevice]);

  const handleClick = () => {
    if (!isLoading && morePosts) {
      const limit = isSmallerDevice ? 5 : 10;
      fetchPosts(page * limit, limit);
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {morePosts && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}
