export function displayBlogPosts() {
  const postListContainer = document.querySelector(".blog-posts");

  document.addEventListener("DOMContentLoaded", function () {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];

    if (posts.length === 0) {
      postListContainer.innerHTML =
        "<p>No blog posts available. Create one to get started!</p>";
      return;
    }

    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("blog-post");

      const imageUrl = post.imageUrl || "default-image.jpg"; // Ensure consistency with imageUrl field
      const truncatedContent =
        post.content.length > 100
          ? `${post.content.substring(0, 100)}...`
          : post.content;

      postElement.innerHTML = `
            <h3>${post.title}</h3>
            <img src="${imageUrl}" alt="Post Image">
            <p>${truncatedContent}</p>
            <a href="../post/index.html?id=${post.id}" class="read-more">Read More</a>
        `;

      postListContainer.appendChild(postElement);
    });
  });
}
