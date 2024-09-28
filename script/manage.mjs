import { BLOG_POSTS_ALL, DELETE_POST_API_ENDPOINT } from "./shared/api.mjs";
import { checkLoginStatus, isUserSignedIn } from "./shared/auth.mjs";
import { showLoader, hideLoader } from "./shared/loader.mjs";

// Fetch all blog posts from API (for `colorMuse`)
async function fetchPostsFromAPI() {
  showLoader();
  try {
    const response = await fetch(BLOG_POSTS_ALL);
    if (!response.ok) {
      throw new Error("Error fetching posts.");
    }
    const posts = await response.json();
    return posts.data;
  } catch (error) {
    console.error("Error fetching posts from API:", error);
    return [];
  } finally {
    hideLoader();
  }
}

function fetchPostsFromLocalStorage() {
  const username = localStorage.getItem("username");
  return JSON.parse(localStorage.getItem(`posts_${username}`)) || [];
}

function deletePostFromLocalStorage(postId) {
  const username = localStorage.getItem("username");
  let posts = fetchPostsFromLocalStorage(); 
  posts = posts.filter((post) => post.id !== parseInt(postId));

  localStorage.setItem(`posts_${username}`, JSON.stringify(posts));
  alert("Post deleted successfully.");

  window.location.reload();
}
async function deletePost(postId) {
  const username = localStorage.getItem("username");
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  showLoader();

  if (username === "colorMuse") {
    try {
      const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post from API.");
      }

      alert("Post deleted successfully.");
      window.location.reload();
      console.error("Error deleting post from API:", error);
      alert("Failed to delete post. Please try again later.");
    } finally {
      hideLoader();
    }
  } else {
    deletePostFromLocalStorage(postId);
    hideLoader();
  }
}
function renderPosts(posts) {
  const postsContainer = document.querySelector(".post-grid");
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts available.</p>";
    return;
  }

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");

    postCard.innerHTML = `
            <div class="post-image">
                <a href="../post/index.html?id=${post.id}">
                    <img src="${
                      post.media?.url || "https://via.placeholder.com/150x100"
                    }" alt="Post Image">
                </a>
            </div>
            <div class="post-title">
                <h3>${post.title}</h3>
            </div>
            <div class="post-buttons">
                <button class="edit-btn" data-id="${post.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <a href="../post/index.html?id=${post.id}" class="view-icon">
                    <i class="fas fa-eye"></i>
                </a>
                <button class="delete-btn" data-id="${post.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

    postsContainer.appendChild(postCard);
  });

  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const postId = e.target.dataset.id;
      window.location.href = `../post/edit.html?id=${postId}`;
    });
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const postId = e.target.dataset.id;
      deletePost(postId);
    });
  });
}

async function main() {
  const username = localStorage.getItem("username");
  let posts = [];

  showLoader();

  if (username === "colorMuse") {
    posts = await fetchPostsFromAPI();
  } else {
    posts = fetchPostsFromLocalStorage();
  }

  renderPosts(posts);
  hideLoader();
}
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus();
  main();
});

document.querySelector(".create-post-btn").addEventListener("click", () => {
  window.location.href = "../post/createPost.html";
});

