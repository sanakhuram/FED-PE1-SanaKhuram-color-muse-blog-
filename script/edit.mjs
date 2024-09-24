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
  try {
    const response = await fetch(GET_BLOG_POST_BY_ID(postId));
    if (!response.ok) {
      throw new Error("Failed to fetch post data");
    }
    const postData = await response.json();
    return postData;
  } catch (error) {
    console.error("Error fetching post data:", error);
    return null;
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
  if (post && post.data) {
    console.log("Loaded post:", post.data); 

    imageURLInput.value = post.data.media?.url || "";
    imageAltTextInput.value = post.data.media?.alt || ""; 
    postTitleInput.value = post.data.title || "";
    postContentInput.value = post.data.body || "";
    tagsInput.value = (post.data.tags || []).join(", ");

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

async function handleSaveChanges(e) {
  e.preventDefault();
  showLoader();  // Show loader when saving changes
  
  const tagsArray = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  const updatedPostData = {
    title: postTitleInput?.value || "",
    body: postContentInput?.value || "",
    media: {
      url: imageURLInput?.value || "",
      alt: imageAltTextInput?.value || "Post Image"  
     },
    tags: tagsArray
  };

  try {
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

  showLoader();  // Show loader when deleting the post

  try {
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


// References 😊:
// 1. Fetch API - For fetching and manipulating data from the API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API🌐
// 2. PUT Method - For updating existing data on the server: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT
// 3. DELETE Method - For deleting data from the server: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE
// 4. Form Handling and Event Listeners - For handling form submissions and updating UI based on user input: https://developer.mozilla.org/en-US/docs/Web/API/EventListener
// Videos 📺:
// - [JavaScript Fetch API Crash Course](https://www.youtube.com/watch?v=cuEtnrL9-H0)
// - [Understanding HTTP Methods](https://www.youtube.com/watch?v=vV0bZKIyxmM)
// - ChatGPT for error handling and helping through out coding 🙏.