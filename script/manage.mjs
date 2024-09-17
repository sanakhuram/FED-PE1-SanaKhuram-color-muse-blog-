import { BLOG_POSTS_API_ENDPOINT, DELETE_POST_API_ENDPOINT } from './shared/api.mjs'; 
import { isUserSignedIn, checkLoginStatus } from './shared/auth.mjs'; 

document.addEventListener('DOMContentLoaded', async () => {
  checkLoginStatus(); // Ensure user is logged in

  if (!isUserSignedIn()) {
    window.location.href = '../account/login.html'; // Redirect if not signed in
    return;
  }

  // Function to fetch posts from the API
  async function fetchPosts() {
    try {
      const response = await fetch(BLOG_POSTS_API_ENDPOINT);
      if (!response.ok) {
        throw new Error('Error fetching posts.');
      }
      const posts = await response.json();
      return posts.data; // Assuming posts are in the "data" field
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  // Function to delete a post by ID
  async function deletePost(postId) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Use token for authentication
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post.');
      }

      alert('Post deleted successfully.');
      window.location.reload(); // Reload the page to reflect the deleted post
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  // Function to render posts
  function renderPosts(posts) {
    const postsContainer = document.querySelector('.post-grid'); // Container for the posts
    postsContainer.innerHTML = ''; // Clear any existing content

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>No posts available.</p>'; // Show this if there are no posts
      return;
    }

    posts.forEach((post) => {
      // Create post card dynamically based on the structure you like
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

    // Add event listeners for Edit and Delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.getAttribute('data-id');
        window.location.href = `../post/edit.html?id=${postId}`; // Redirect to edit page with post ID
      });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const postId = e.target.getAttribute('data-id');
        deletePost(postId); // Call the delete function
      });
    });
  }

  // Fetch and render posts on page load
  const posts = await fetchPosts();
  renderPosts(posts);
});

// Add click event for creating a post
document.querySelector('.create-post-btn').addEventListener('click', () => {
  window.location.href = '../post/createPost.html'; // Redirect to the create post page
});
