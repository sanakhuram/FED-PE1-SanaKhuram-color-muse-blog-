import { BLOG_POSTS_API_ENDPOINT, DELETE_POST_API_ENDPOINT } from './shared/api.mjs'; 
import { isUserSignedIn, checkLoginStatus } from './shared/auth.mjs'; 

document.addEventListener('DOMContentLoaded', async () => {
  checkLoginStatus(); 

  if (!isUserSignedIn()) {
    window.location.href = '../account/login.html'; 
    return;
  }

 
  async function fetchPosts() {
    try {
      const response = await fetch(BLOG_POSTS_API_ENDPOINT);
      if (!response.ok) {
        throw new Error('Error fetching posts.');
      }
      const posts = await response.json();
      return posts.data; 
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

 
  async function deletePost(postId) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post.');
      }

      alert('Post deleted successfully.');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }


  function renderPosts(posts) {
    const postsContainer = document.querySelector('.post-grid'); 
    postsContainer.innerHTML = ''; 

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>No posts available.</p>'; 
      return;
    }

    posts.forEach((post) => {
      
      const postCard = document.createElement('div');
      postCard.classList.add('post-card');
      
      postCard.innerHTML = `
        <div class="post-image">
          <a href="../post/index.html?id=${post.id}">
            <img src="${post.media?.url || 'https://via.placeholder.com/600x400'}" alt="Post Image">
          </a>
        </div>
        <div class="post-buttons">
          <button class="edit-btn" data-id="${post.id}">Edit</button>
          <button class="delete-btn" data-id="${post.id}">Delete</button>
        </div>
      `;

      postsContainer.appendChild(postCard);
    });

 
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.getAttribute('data-id');
        window.location.href = `../post/edit.html?id=${postId}`; 
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.getAttribute('data-id');
        deletePost(postId); 
      });
    });
  }


  const posts = await fetchPosts();
  renderPosts(posts);
});


document.querySelector('.create-post-btn').addEventListener('click', () => {
  window.location.href = '../post/createPost.html';
});
