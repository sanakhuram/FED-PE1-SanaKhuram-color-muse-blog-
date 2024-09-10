//api.mjs
const BASE_API_URL = 'https://v2.api.noroff.dev';

export const REGISTER_API_ENDPOINT = `${BASE_API_URL}/auth/register`;
export const LOGIN_API_ENDPOINT = `${BASE_API_URL}/auth/login`;

const REGISTERED_BLOG_NAME = 'sana';

export const BLOG_POSTS_API_ENDPOINT = `${BASE_API_URL}/blog/posts/${REGISTERED_BLOG_NAME}`;
