// fetchUtils.mjs
export async function fetchPosts() {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  if (posts.length === 0) {
    try {
      const response = await fetch(BLOG_POSTS_API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      posts = await response.json(); // Parse JSON response
      localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }
  return posts;
}
