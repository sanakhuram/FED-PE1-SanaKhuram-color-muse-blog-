// edit.mjs
import { fetchPosts } from './fetchUtils.mjs';
import { BLOG_POSTS_API_ENDPOINT } from './shared/api.mjs'; 
import { getAccessToken } from './shared/accessToken.mjs';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');


const posts = JSON.parse(localStorage.getItem('posts')) || [];
const post = posts.find(p => p.id == postId);

const postTitleInput = document.getElementById('postTitleForm');
const postContentInput = document.getElementById('postContentForm');
const imageUrlInput = document.getElementById('imageURL');


if (post) {
    postTitleInput.value = post.title;
    postContentInput.value = post.content;
    imageUrlInput.value = post.imageUrl;
}


document.querySelector('.postFormContainer').addEventListener('submit', (event) => {
    event.preventDefault();
    
 
    post.title = postTitleInput.value;
    post.content = postContentInput.value;
    post.imageUrl = imageUrlInput.value;
    post.updatedAt = new Date().toLocaleString();
    
   
    localStorage.setItem('posts', JSON.stringify(posts));
  
    window.location.href = `../post/index.html?id=${post.id}`;
});


document.querySelector('.deleteButtonEditPage').addEventListener('click', () => {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
        const updatedPosts = posts.filter(p => p.id != postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        window.location.href = '../index.html';
    }
});
