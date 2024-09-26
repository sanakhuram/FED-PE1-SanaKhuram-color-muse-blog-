// Base URL for the API
const BASE_API_URL = "https://v2.api.noroff.dev";

export const REGISTER_API_ENDPOINT = `${BASE_API_URL}/auth/register`;
export const LOGIN_API_ENDPOINT = `${BASE_API_URL}/auth/login`;

const REGISTER_BLOG_NAME = "colorMuse";
export const BLOG_POSTS_ALL = `${BASE_API_URL}/blog/posts/${REGISTER_BLOG_NAME}`;

export const GET_BLOG_POST_BY_ID = (postId) =>
  `${BASE_API_URL}/blog/posts/${REGISTER_BLOG_NAME}/${postId}`;

export const UPDATE_BLOG_POST_BY_ID = (postId) =>
  `${BASE_API_URL}/blog/posts/${REGISTER_BLOG_NAME}/${postId}`;

export const DELETE_POST_API_ENDPOINT = (postId) =>
  `${BASE_API_URL}/blog/posts/${REGISTER_BLOG_NAME}/${postId}`;


