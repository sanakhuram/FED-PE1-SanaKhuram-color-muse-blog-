
export async function setupCarousel(posts) {
  if (!posts || posts.length === 0) {
      return;
  }

  const latestPosts = posts.sort((a, b) => new Date(b.created) - new Date(a.created)).slice(0, 3);

  const carouselImage = document.querySelector(".carousel-blog-post-image");
  const carouselTitle = document.getElementById("carousel-title");
  const scrollLeftButton = document.querySelector(".scroll-left");
  const scrollRightButton = document.querySelector(".scroll-right");

  let currentIndex = 0;

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
      if (postId) {
          window.location.href = `./post/index.html?id=${postId}`;
      }
  });
}



// References 😊:

// Date Manipulation: Sorting posts by creation date. 🗓️
// MDN Docs - Date: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

// Array Methods: Array sorting and slicing for handling posts. 📚
// MDN Docs - Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

// Event Listeners: Adding functionality to buttons for scrolling through carousel posts. ✨
// MDN Docs - addEventListener(): https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

