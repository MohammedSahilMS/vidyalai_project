const express = require('express');
const { fetchPosts } = require('./posts.service');
const axios = require('axios'); 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    
    const posts = await fetchPosts();

    const fetchImagesForPost = async (post) => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
        return {
          ...post,
          images: response.data.map(photo => ({ url: photo.url }))
        };
      } catch (error) {
        console.error(`Failed to fetch images for post ${post.id}:`, error);
        return {
          ...post,
          images: []
        };
      }
    };

    const postsWithImages = await Promise.all(posts.map(fetchImagesForPost));


    res.json(postsWithImages);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
