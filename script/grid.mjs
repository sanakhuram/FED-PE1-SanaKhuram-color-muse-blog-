export function displayBlogPosts(posts) {
  const postListContainer = document.querySelector(".blog-posts");

  postListContainer.innerHTML = ""; // Clear existing content

  if (!Array.isArray(posts) || posts.length === 0) { 
      postListContainer.innerHTML = "<p>No blog posts available. Create one to get started!</p>";
      console.log("No blog posts found.");
      return;
  }

  posts.forEach((post) => {
      console.log("Rendering post: ", post); // Log each post to see if it's processed

      const postElement = document.createElement("div");
      postElement.classList.add("blog-post");

      const imageUrl = post.media?.url || post.imageUrl || "https://via.placeholder.com/600x400?text=No+Image";
      const truncatedContent = post.body.length > 100 ? `${post.body.substring(0, 100)}...` : post.body;

      postElement.innerHTML = `
          <h3>${post.title}</h3>
          <img src="${imageUrl}" alt="Post Image">
          <p>${truncatedContent}</p>
          <a href="#" class="read-more" data-id="${post.id}">Read More</a>
      `;

      postListContainer.appendChild(postElement);
  });

  // Add event listeners for "Read More" links after posts have been rendered
  document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior
      const postId = this.getAttribute('data-id');
      
      // Check if the user is signed in
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        // If signed in, redirect to the post.html
        window.location.href = `./post/index.html?id=${postId}`;
      } else {
        // If not signed in, prompt them to log in
        alert('Please sign in to view this post.');
        window.location.href = './account/login.html'; // Redirect to login page
      }
    });
  });
}
