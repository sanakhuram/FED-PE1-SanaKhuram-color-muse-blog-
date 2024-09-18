import { BLOG_POSTS_API_ENDPOINT, DELETE_POST_API_ENDPOINT } from './shared/api.mjs';
import { checkLoginStatus, isUserSignedIn } from './shared/auth.mjs';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');


const imageURLInput = document.getElementById('imageURL');
const postTitleInput = document.getElementById('postTitleForm');
const postContentInput = document.getElementById('postContentForm');
const deleteButton = document.querySelector('.deleteButtonEditPage');
const saveButton = document.querySelector('.post-button button');
const counterElement = document.getElementById('counter');


document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();  
  if (!isUserSignedIn()) {
    window.location.href = '../account/login.html';  
  }
});


async function fetchPostData(postId) {
  try {
    console.log("Fetching post data for post ID:", postId); 

    const response = await fetch(`${BLOG_POSTS_API_ENDPOINT}/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post data');
    }
    const postData = await response.json();

    console.log("Fetched Post Data:", postData); 
    return postData;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}


async function loadPostForEditing() {
  if (!postId) {
    console.error('No post ID found in the URL');
    return;
  }

  const post = await fetchPostData(postId);

  if (post && post.data) {  
    imageURLInput.value = post.data.media?.url || '';
    postTitleInput.value = post.data.title || '';
    postContentInput.value = post.data.body || post.data.content || '';
    updateCounter(); 
  } else {
    alert('Failed to load post data.');
  }
}


function updateCounter() {
  const contentLength = postContentInput.value.length;
  counterElement.textContent = `${contentLength}/2000`;
}


async function handleSaveChanges(e) {
  e.preventDefault();
  
  const updatedPostData = {
    title: postTitleInput.value,
    body: postContentInput.value,
    media: { url: imageURLInput.value }
  };

  try {
    console.log("Updating post with data:", updatedPostData); 

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
    window.location.href = `../post/index.html?id=${postId}`; 
  } catch (error) {
    console.error('Error updating post:', error);
  }
}


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
    window.location.href = '../index.html'; 
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

postContentInput.addEventListener('input', updateCounter);
saveButton.addEventListener('click', handleSaveChanges);
deleteButton.addEventListener('click', handleDeletePost);

document.addEventListener('DOMContentLoaded', loadPostForEditing);
