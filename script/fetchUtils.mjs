export async function fetchPosts() {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  const currentUser = localStorage.getItem('username'); // Get the logged-in username

  if (posts.length === 0) {
    try {
      const response = await fetch(BLOG_POSTS_API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      posts = await response.json();
      localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  // Filter posts by the current logged-in user
  if (currentUser) {
    posts = posts.filter(post => post.author === currentUser);
  }

  return posts;
}
