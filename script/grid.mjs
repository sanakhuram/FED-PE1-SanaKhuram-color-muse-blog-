export function displayBlogPosts(posts) {
  const postListContainer = document.querySelector(".blog-posts");

  postListContainer.innerHTML = ""; 

  if (!Array.isArray(posts) || posts.length === 0) { 
      postListContainer.innerHTML = "<p>No blog posts available. Create one to get started!</p>";
      console.log("No blog posts found.");
      return;
  }

  posts.forEach((post) => {
      console.log("Rendering post: ", post); 

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


  document.querySelectorAll('.read-more').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const postId = this.getAttribute('data-id');
      
    
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
   
        window.location.href = `./post/index.html?id=${postId}`;
      } else {
       
        alert('Please sign in to view this post.');
        window.location.href = './account/login.html'; 
      }
    });
  });
}
