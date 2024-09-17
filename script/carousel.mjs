import { BLOG_POSTS_API_ENDPOINT } from './shared/api.mjs'; // Adjust the import based on your folder structure
import { isUserSignedIn } from './shared/auth.mjs'; // Import auth check

export async function setupCarousel() {
  try {
    // Fetch posts from the API
    const response = await fetch(BLOG_POSTS_API_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response
    const posts = Array.isArray(data.data) ? data.data : []; // Check if 'data' contains posts

    if (posts.length === 0) {
      console.error("No posts provided to the carousel.");
      return;
    }

    console.log("Posts for carousel: ", posts); // Log posts for debugging

    // Sort the posts by the created date to get the latest posts
    const latestPosts = posts.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 3);

    // Select carousel elements
    const carouselImage = document.querySelector(".carousel-blog-post-image");
    const carouselTitle = document.getElementById("carousel-title");
    const scrollLeftButton = document.querySelector(".scroll-left");
    const scrollRightButton = document.querySelector(".scroll-right");

    let currentIndex = 0;

    // Function to update the carousel display
    function updateCarousel() {
      const currentPost = latestPosts[currentIndex];
      console.log("Current Post in Carousel:", currentPost); // Debugging log

      if (!currentPost) {
        console.error("Invalid post data:", currentIndex);
        carouselImage.src = 'https://via.placeholder.com/600x400?text=No+Image';
        carouselTitle.textContent = 'Untitled Post';
        return;
      }

      const imageUrl =
        currentPost.media?.url || // Check if media URL exists
        'https://via.placeholder.com/600x400?text=No+Image'; // Fallback image

      const title = currentPost.title || 'Untitled Post';

      carouselImage.src = imageUrl;
      carouselTitle.textContent = title;
      carouselImage.dataset.postId = currentPost.id;
    }

    updateCarousel(); // Initialize the first post

    // Event listeners for carousel navigation
    scrollLeftButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + latestPosts.length) % latestPosts.length;
      updateCarousel();
    });

    scrollRightButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % latestPosts.length;
      updateCarousel();
    });

    // Navigate to the post preview on carousel image click
    carouselImage.addEventListener('click', () => {
      const postId = carouselImage.dataset.postId;
      
      // If user is signed in, allow access to post, otherwise redirect to login
      if (isUserSignedIn()) {
        if (postId) {
          window.location.href = `./post/index.html?id=${postId}`;
        } else {
          console.error("Post ID is missing");
        }
      } else {
        // Redirect to login if not signed in
        window.location.href = './account/login.html';
      }
    });
  } catch (error) {
    console.error("Error fetching posts for carousel:", error);
  }
}
