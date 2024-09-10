//post.mjs
import { fetchPosts } from './fetchUtils.mjs';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Fetch the posts from localStorage
const posts = JSON.parse(localStorage.getItem('posts')) || [];
const post = posts.find(p => p.id == postId);

// DOM elements for post content
const postTitle = document.getElementById('postHeaderTitle');
const postAuthor = document.getElementById('postAuthor');
const postImage = document.querySelector('.blogpage-image');
const postContent = document.getElementById('blogpost-text');
const postCreated = document.getElementById('publicationDate');
const postUpdated = document.getElementById('updatedTime');
const editPostBtn = document.getElementById('editPostBtn');
const deletePostBtn = document.getElementById('deletePostBtn');

if (post) {
    // Set the title, image, and content
    if (postTitle) postTitle.innerText = post.title || 'No title available';
    if (postImage) postImage.src = post.imageUrl || 'default-image-url.jpg';
    if (postContent) postContent.innerText = post.content || 'No content available';

    // Set the author, created date, and updated date
    if (postAuthor) postAuthor.innerText = post.author?.name || 'Unknown Author';
    if (postCreated) postCreated.innerText = `Publication Date: ${new Date(post.created).toLocaleDateString() || 'Unknown'}`;
    if (postUpdated) postUpdated.innerText = post.updated ? `Last Updated: ${new Date(post.updated).toLocaleDateString()}` : 'Not updated yet';

    // Edit post button handler
    if (editPostBtn) {
        editPostBtn.addEventListener('click', () => {
            if (post.id) {
                window.location.href = `edit.html?id=${post.id}`;
            } else {
                console.error("Post ID is missing");
            }
        });
    }

    // Delete post button handler
    if (deletePostBtn) {
        deletePostBtn.addEventListener('click', () => {
            const confirmDelete = confirm('Are you sure you want to delete this post?');
            if (confirmDelete && post.id) {
                const updatedPosts = posts.filter(p => p.id != postId);
                localStorage.setItem('posts', JSON.stringify(updatedPosts));
                window.location.href = '../index.html';
            } else {
                console.error("Unable to delete, post ID is missing");
            }
        });
    }
} else {
    // Handle case when post is not found
    if (postTitle) postTitle.innerText = 'Post not found';
    if (postContent) postContent.innerText = 'No content available';
    if (postAuthor) postAuthor.innerText = 'Unknown Author';
    if (postCreated) postCreated.innerText = 'Unknown';
    if (postUpdated) postUpdated.innerText = 'Not updated yet';
}
