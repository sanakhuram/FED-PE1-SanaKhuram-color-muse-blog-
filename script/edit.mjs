import {
  GET_BLOG_POST_BY_ID,
  UPDATE_BLOG_POST_BY_ID,
  DELETE_POST_API_ENDPOINT,
} from "./shared/api.mjs";
import { showLoader, hideLoader } from './shared/loader.mjs';  

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");

const imageURLInput = document.getElementById("imageURL");
const imageAltTextInput = document.getElementById("imageAltText"); 
const postTitleInput = document.getElementById("postTitleForm");
const postContentInput = document.getElementById("postContentForm");
const deleteButton = document.querySelector(".deleteButtonEditPage");
const saveButton = document.querySelector("button[type='submit']"); 
const counterElement = document.getElementById("counter");
const tagsInput = document.getElementById('tagsInput'); 

// Fetch and handle blog post data based on the post ID from URL
async function fetchPostData(postId) {
  const username = localStorage.getItem('username');

  if (username === 'colorMuse') {
    // Fetch from API if user is `colorMuse`
    try {
      const response = await fetch(GET_BLOG_POST_BY_ID(postId));
      if (!response.ok) {
        throw new Error("Failed to fetch post data from API");
      }
      const postData = await response.json();
      return postData.data;
    } catch (error) {
      console.error("Error fetching post data from API:", error);
      return null;
    }
  } else {
    // Fetch from local storage for regular users
    const posts = JSON.parse(localStorage.getItem(`posts_${username}`)) || [];
    return posts.find(post => post.id === parseInt(postId));
  }
}

async function loadPostForEditing() {
  showLoader();  
  if (!postId) {
    console.error("Post ID not found");
    hideLoader();  
    return;
  }

  const post = await fetchPostData(postId);
  if (post) {
    imageURLInput.value = post.media?.url || "";
    imageAltTextInput.value = post.media?.alt || ""; 
    postTitleInput.value = post.title || "";
    postContentInput.value = post.body || "";
    tagsInput.value = (post.tags || []).join(", ");

    updateCounter();
    postContentInput.addEventListener("input", updateCounter);
  } else {
    alert("Failed to load post data.");
  }
  hideLoader();  
}

// Updates character counter for the post content input
function updateCounter() {
  const contentLength = postContentInput?.value.length || 0;
  if (counterElement) {
    counterElement.textContent = `${contentLength}/10000`;
  }
}

// Save changes (API for admin, localStorage for regular users)
async function handleSaveChanges(e) {
  e.preventDefault();
  showLoader();  

  const username = localStorage.getItem('username');
  const tagsArray = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  const updatedPostData = {
    id: postId, 
    title: postTitleInput?.value || "",
    body: postContentInput?.value || "",
    media: {
      url: imageURLInput?.value || "",
      alt: imageAltTextInput?.value || "Post Image"  
    },
    tags: tagsArray
  };

  try {
    if (username === 'colorMuse') {
      // Admin: Update post via API
      const response = await fetch(UPDATE_BLOG_POST_BY_ID(postId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedPostData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to update post. ${response.statusText}: ${errorText}`);
      } else {
        alert("Post updated successfully!");
        window.location.href = `../post/index.html?id=${postId}`;
      }
    } else {
      // Regular User: Update post in localStorage
      let posts = JSON.parse(localStorage.getItem(`posts_${username}`)) || [];
      posts = posts.map(post => post.id === parseInt(postId) ? updatedPostData : post);
      localStorage.setItem(`posts_${username}`, JSON.stringify(posts));
      alert("Post updated successfully!");
      window.location.href = '../index.html';  
    }
  } catch (error) {
    console.error("Error updating post:", error);
    alert(`Error updating post: ${error.message}`);
  } finally {
    hideLoader();  
  }
}

// Handles deletion of a blog post

async function handleDeletePost() {
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  const username = localStorage.getItem('username');

  showLoader();  

  try {
    if (username === 'colorMuse') {
      // Admin: Delete via API
      const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete post: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      alert("Post deleted successfully!");
      window.location.href = "../index.html";
    } else {
      // Regular User: Delete from localStorage
      let posts = JSON.parse(localStorage.getItem(`posts_${username}`)) || [];
      posts = posts.filter(post => post.id !== parseInt(postId));
      localStorage.setItem(`posts_${username}`, JSON.stringify(posts));
      alert("Post deleted successfully!");
      window.location.href = '../index.html';  
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    alert(`Error deleting post: ${error.message}`);
  } finally {
    hideLoader();  
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (saveButton) {
    saveButton.addEventListener("click", handleSaveChanges);
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", handleDeletePost);
  }

  loadPostForEditing();
});

if (postContentInput) {
  postContentInput.addEventListener("input", updateCounter);
}

