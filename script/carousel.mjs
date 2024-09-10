// Carousel setup function
import { fetchPosts } from './fetchUtils.mjs';

export async function setupCarousel() {
    let posts = await fetchPosts(); // Fetch posts dynamically
  
    if (!posts || posts.length === 0) {
      console.error("No posts provided to the carousel.");
      return;
    }
  
    // Get only the last three posts
    posts = posts.slice(-3); 
  
    const carouselImage = document.querySelector(".carousel-blog-post-image");
    const carouselTitle = document.getElementById("carousel-title");
    const scrollLeftButton = document.querySelector(".scroll-left");
    const scrollRightButton = document.querySelector(".scroll-right");
  
    let currentIndex = 0;
  
    function updateCarousel() {
      const currentPost = posts[currentIndex];
      console.log("Current Post:", currentPost);
  
      if (!currentPost) {
        console.error("Invalid post data:", currentIndex);
        carouselImage.src = 'https://via.placeholder.com/600x400?text=No+Image';
        carouselTitle.textContent = 'Untitled Post';
        return;
      }
  
      const imageUrl = currentPost.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';
      const title = currentPost.title || 'Untitled Post';
  
      console.log("Image URL:", imageUrl); // Log image URL to see if it's valid
      carouselImage.src = imageUrl;
      carouselTitle.textContent = title;
      carouselImage.dataset.postId = currentPost.id;
    }
  
    updateCarousel();
  
    // Event listeners for carousel navigation
    scrollLeftButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + posts.length) % posts.length;
      updateCarousel();
    });
  
    scrollRightButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % posts.length;
      updateCarousel();
    });
  
    // Navigate to post preview on click
    carouselImage.addEventListener('click', () => {
      const postId = carouselImage.dataset.postId;
      if (postId) {
        window.location.href = `./post/index.html?id=${postId}`;
      } else {
        console.error("Post ID is missing");
      }
    });
  }
  