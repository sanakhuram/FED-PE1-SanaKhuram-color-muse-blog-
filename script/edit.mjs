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
  showLoader();  // Show loader when fetching the post
  if (!postId) {
    console.error("Post ID not found");
    hideLoader();  // Hide loader if no postId is found
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
  hideLoader();  // Hide loader after data is fetched or an error occurs
}

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
    hideLoader();  // Hide loader after the operation is complete
  }
}

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
    hideLoader();  // Hide loader after the operation is complete
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
