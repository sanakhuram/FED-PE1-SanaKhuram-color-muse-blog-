let currentPage = 1;
const postsPerPage = 12; 

export function displayPaginatedPosts(posts, displayBlogPosts) {
  const postListContainer = document.querySelector(".blog-posts");

  function renderPosts() {
    postListContainer.innerHTML = "";

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = posts.slice(start, end);

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
