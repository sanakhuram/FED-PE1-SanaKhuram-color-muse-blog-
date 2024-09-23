let currentPage = 1;
const postsPerPage = 12; 

export function displayPaginatedPosts(posts, displayBlogPosts) {
  const postListContainer = document.querySelector(".blog-posts");

  // Function to render the paginated posts
  
  function renderPosts() {
    postListContainer.innerHTML = "";

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = posts.slice(start, end);

    // If no posts are available, display a message
    
    if (paginatedPosts.length === 0) {
      postListContainer.innerHTML = "<p>No blog posts available. Create one to get started!</p>";
      return;
    }

    displayBlogPosts(paginatedPosts);

  
    updatePaginationInfo(posts);
  }

  function updatePaginationInfo(posts) {
    const paginationInfo = document.getElementById("pagination-info");
    const totalPages = Math.ceil(posts.length / postsPerPage);
    paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  document.querySelector(".pagination-previous").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPosts();
    }
  });

  document.querySelector(".pagination-next").addEventListener("click", () => {
    if (currentPage * postsPerPage < posts.length) {
      currentPage++;
      renderPosts();
    }
  });

  renderPosts(); 
}

// References 😊:

// Event Listeners: Attaches event handlers to DOM elements like buttons. 🔗
// MDN Web Docs - addEventListener(): https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

// Array slice(): Extracts a portion of an array into a new array. 📚
// MDN Web Docs - Array.prototype.slice(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice

// Pagination Logic: General resource on implementing pagination. 📝
// JavaScript Pagination: https://www.sitepoint.com/pagination-javascript

// - ChatGPT for error handling and helping through out coding.