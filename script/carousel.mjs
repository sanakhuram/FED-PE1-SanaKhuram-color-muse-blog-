import { BLOG_POSTS_API_ENDPOINT } from './shared/api.mjs'; 
import { isUserSignedIn } from './shared/auth.mjs'; 

export async function setupCarousel() {
  try {
    // Fetch posts from the API
    const response = await fetch(BLOG_POSTS_API_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); 
    const posts = Array.isArray(data.data) ? data.data : []; 

    if (posts.length === 0) {
      console.error("No posts provided to the carousel.");
      return;
    }

    console.log("Posts for carousel: ", posts); 

  
    const latestPosts = posts.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 3);

   
    const carouselImage = document.querySelector(".carousel-blog-post-image");
    const carouselTitle = document.getElementById("carousel-title");
    const scrollLeftButton = document.querySelector(".scroll-left");
    const scrollRightButton = document.querySelector(".scroll-right");

    let currentIndex = 0;

   
    function updateCarousel() {
      const currentPost = latestPosts[currentIndex];
      console.log("Current Post in Carousel:", currentPost); 

      if (!currentPost) {
        console.error("Invalid post data:", currentIndex);
        carouselImage.src = 'https://via.placeholder.com/600x400?text=No+Image';
        carouselTitle.textContent = 'Untitled Post';
        return;
      }

      const imageUrl =
        currentPost.media?.url || 
        'https://via.placeholder.com/600x400?text=No+Image'; 

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
        } else {
          console.error("Post ID is missing");
        }
      } else {
       
        window.location.href = './account/login.html';
      }
    });
  } catch (error) {
    console.error("Error fetching posts for carousel:", error);
  }
}
