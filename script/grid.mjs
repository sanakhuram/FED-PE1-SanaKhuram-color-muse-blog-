export function displayBlogPosts(posts) {
  const postListContainer = document.querySelector(".blog-posts");
  postListContainer.innerHTML = ""; 

  if (!Array.isArray(posts) || posts.length === 0) {
      postListContainer.innerHTML = "<p>No blog posts available. Create one to get started!</p>";
      return;
  }

  posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("blog-post");

      const imageUrl = post.media?.url || "https://via.placeholder.com/600x400?text=No+Image";
      const truncatedContent = post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body;

      postElement.innerHTML = `
          <h3>${post.title}</h3>
          <img src="${imageUrl}" alt="Post Image">
          <p>${truncatedContent}</p>
          <a href="./post/index.html?id=${post.id}" class="read-more" data-id="${post.id}">
              Read More <i class="fas fa-arrow-right"></i>
          </a>
      `;

      postListContainer.appendChild(postElement);
  });
}
