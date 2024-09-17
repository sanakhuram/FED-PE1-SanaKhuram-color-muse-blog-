import { BLOG_POSTS_API_ENDPOINT, DELETE_POST_API_ENDPOINT } from './shared/api.mjs';
import { checkLoginStatus, isUserSignedIn } from './shared/auth.mjs';

// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// DOM Elements
const imageURLInput = document.getElementById('imageURL');
const postTitleInput = document.getElementById('postTitleForm');
const postContentInput = document.getElementById('postContentForm');
const deleteButton = document.querySelector('.deleteButtonEditPage');
const saveButton = document.querySelector('.post-button button');
const counterElement = document.getElementById('counter');

// Ensure user is signed in and update the header
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();  // Check if the user is logged in and update the header
  if (!isUserSignedIn()) {
    window.location.href = '../account/login.html';  // Redirect to login page if not signed in
  }
});

// Fetch the post data by postId
async function fetchPostData(postId) {
  try {
    console.log("Fetching post data for post ID:", postId); // Log the postId to ensure it's being passed correctly

    const response = await fetch(`${BLOG_POSTS_API_ENDPOINT}/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post data');
    }
    const postData = await response.json();

    console.log("Fetched Post Data:", postData); // Log the entire API response for inspection
    return postData;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Load the post data into the form fields
async function loadPostForEditing() {
  if (!postId) {
    console.error('No post ID found in the URL');
    return;
  }

  const post = await fetchPostData(postId);

  if (post && post.data) {  // Accessing the post inside the 'data' object
    imageURLInput.value = post.data.media?.url || '';
    postTitleInput.value = post.data.title || '';
    postContentInput.value = post.data.body || post.data.content || '';
    updateCounter(); // Update the character counter based on the post content
  } else {
    alert('Failed to load post data.');
  }
}

// Update the character counter for post content
function updateCounter() {
  const contentLength = postContentInput.value.length;
  counterElement.textContent = `${contentLength}/2000`;
}

// Handle form submission (save changes)
async function handleSaveChanges(e) {
  e.preventDefault();
  
  const updatedPostData = {
    title: postTitleInput.value,
    body: postContentInput.value,
    media: { url: imageURLInput.value }
  };

  try {
    console.log("Updating post with data:", updatedPostData); // Log the updated post data before sending the request

    const response = await fetch(`${BLOG_POSTS_API_ENDPOINT}/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(updatedPostData),
    });

    if (!response.ok) {
      throw new Error('Failed to update post');
    }

    alert('Post updated successfully!');
    window.location.href = `../post/index.html?id=${postId}`; // Redirect to the post view page
  } catch (error) {
    console.error('Error updating post:', error);
  }
}

// Handle post deletion
async function handleDeletePost() {
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
      throw new Error('Failed to delete post');
    }

    alert('Post deleted successfully!');
    window.location.href = '../index.html'; // Redirect to the main page after deletion
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

// Event listeners
postContentInput.addEventListener('input', updateCounter);
saveButton.addEventListener('click', handleSaveChanges);
deleteButton.addEventListener('click', handleDeletePost);

// Load the post data when the page is ready
document.addEventListener('DOMContentLoaded', loadPostForEditing);
