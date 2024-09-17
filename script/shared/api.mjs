// Base URL for the API
const BASE_API_URL = 'https://v2.api.noroff.dev';

// Auth endpoints
export const REGISTER_API_ENDPOINT = `${BASE_API_URL}/auth/register`;
export const LOGIN_API_ENDPOINT = `${BASE_API_URL}/auth/login`;

export const BLOG_POSTS_API_ENDPOINT = `${BASE_API_URL}/blog/posts/sana`;  

// Delete post API (for deleting specific posts by post ID)
export const DELETE_POST_API_ENDPOINT = (postId) => `${BASE_API_URL}/blog/posts/sana/${postId}`;


