import { BLOG_POSTS_ALL } from './shared/api.mjs'; 
import { isUserSignedIn } from './shared/auth.mjs'; 


// Function to set up the carousel by fetching and displaying blog posts
export async function setupCarousel() {
  try {
    const response = await fetch(BLOG_POSTS_ALL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); 
    const posts = Array.isArray(data.data) ? data.data : []; 

    if (posts.length === 0) {
      console.error("No posts provided to the carousel.");
      return;
    }

    // Get the latest 3 posts sorted by creation date
    
    const latestPosts = posts.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 3);

    const carouselImage = document.querySelector(".carousel-blog-post-image");
    const carouselTitle = document.getElementById("carousel-title");
    const scrollLeftButton = document.querySelector(".scroll-left");
    const scrollRightButton = document.querySelector(".scroll-right");

    let currentIndex = 0;

    // Function to update the carousel with the current post
    
    function updateCarousel() {
      const currentPost = latestPosts[currentIndex];

      if (!currentPost) {
        carouselImage.src = 'https://via.placeholder.com/600x400?text=No+Image';
        carouselTitle.textContent = 'Untitled Post';
        return;
      }

      const imageUrl = currentPost.media?.url || 'https://via.placeholder.com/600x400?text=No+Image'; 
      const title = currentPost.title || 'Untitled Post';

      carouselImage.src = imageUrl;
      carouselTitle.textContent = title;
      carouselImage.dataset.postId = currentPost.id;
    }

    updateCarousel();

    scrollLeftButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + latestPosts.length) % latestPosts.length;
      updateCarousel();
    });

    scrollRightButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % latestPosts.length;
      updateCarousel();
    });

    carouselImage.addEventListener('click', () => {
      const postId = carouselImage.dataset.postId;
      if (isUserSignedIn()) {
        if (postId) {
          window.location.href = `./post/index.html?id=${postId}`;
        }
      } else {
        window.location.href = './account/login.html';
      }
    });
  } catch (error) {
    console.error("Error fetching posts for carousel:", error);
  }
}

// References 😊:
// Fetch API: Handles HTTP requests in JavaScript to fetch blog posts for the carousel. 🌐
// MDN Docs - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

// Date Manipulation: Sorting posts by creation date. 🗓️
// MDN Docs - Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

// Array Methods: Array sorting and slicing for handling posts. 📚
// MDN Docs - Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

// Event Listeners: Adding functionality to buttons for scrolling through carousel posts. ✨
// MDN Docs - addEventListener(): https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
