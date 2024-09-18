import { BLOG_POSTS_ALL } from "./shared/api.mjs"; 

export async function fetchPosts() {
  let posts = JSON.parse(localStorage.getItem('posts')) || [];
  const currentUser = localStorage.getItem('username');

  if (posts.length === 0) {
    try {
      const response = await fetch(BLOG_POSTS_ALL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedPosts = await response.json();
      posts = fetchedPosts.data;
      localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  if (currentUser) {
    posts = posts.filter(post => post.author.name === currentUser);
  }

  return posts;
}
