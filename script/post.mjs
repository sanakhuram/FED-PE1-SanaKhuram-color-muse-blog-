import { GET_BLOG_POST_BY_ID } from './shared/api.mjs';
import { updateHeader } from './shared/auth.mjs';
import { showLoader, hideLoader } from './shared/loader.mjs';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    displayPostNotFound();
}

const postTitle = document.getElementById('postHeaderTitle');
const postAuthor = document.getElementById('postAuthor');
const postImage = document.querySelector('.blogpage-image');
const postContent = document.getElementById('blogpost-text');
const postCreated = document.getElementById('publicationDate');
const postUpdated = document.getElementById('updatedTime');

async function fetchPostById(postId) {
    try {
        const response = await fetch(GET_BLOG_POST_BY_ID(postId));
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const post = await response.json();
        return post;
    } catch (error) {
        return null;
    }
}

async function loadPost() {
    showLoader();

    if (!postId) {
        displayPostNotFound();
        hideLoader();
        return;
    }

    const post = await fetchPostById(postId);

    if (post && post.data) {
        postTitle.innerText = post.data.title || 'No title available';
        postImage.src = post.data.media?.url || 'https://via.placeholder.com/600x400?text=No+Image';
        postContent.innerText = post.data.body || 'No content available';
        postAuthor.innerText = post.data.author?.name || 'Unknown Author';
        postCreated.innerText = post.data.created ? `Publication Date: ${new Date(post.data.created).toLocaleDateString()}` : 'Unknown';
        postUpdated.innerText = post.data.updated ? `Last Updated: ${new Date(post.data.updated).toLocaleDateString()}` : 'Not updated yet';
    } else {
        displayPostNotFound();
    }
    hideLoader();
}

function displayPostNotFound() {
    postTitle.innerText = 'Post not found';
    postContent.innerText = 'No content available';
    postAuthor.innerText = 'Unknown Author';
    postCreated.innerText = 'Unknown';
    postUpdated.innerText = 'Not updated yet';
}

document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    updateHeader(username);
    loadPost();
});

document.getElementById("shareLink").addEventListener("click", function (e) {
    e.preventDefault();

    const postUrl = window.location.href;

    navigator.clipboard
        .writeText(postUrl)
        .then(() => {
            alert("Post URL copied to clipboard!");
        })
        .catch(() => {
            alert("Could not copy the post URL. Please try again.");
        });
});
