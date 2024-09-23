import { GET_BLOG_POST_BY_ID } from './shared/api.mjs';
import { updateHeader } from './shared/auth.mjs';
import { showLoader, hideLoader } from './shared/loader.mjs';

// Extract the 'id' query parameter from the URL
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

// Function to fetch a blog post by ID from the API

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

   // If the post is successfully fetched, display the details on the page
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

// Function to display 'Post not found' message when the post cannot be fetched
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

 // Use the clipboard API to copy the post URL
    navigator.clipboard
        .writeText(postUrl)
        .then(() => {
            alert("Post URL copied to clipboard!");
        })
        .catch(() => {
            alert("Could not copy the post URL. Please try again.");
        });
});

// References 😊:
// Fetch API: Fetches data from a server using JavaScript. 🌐
// MDN Docs - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

// Clipboard API: Allows copying content to the system clipboard. 📋
// MDN Docs - Clipboard API: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API

// Date Formatting with toLocaleDateString(): Formats dates in a human-readable format. 📅
// MDN Docs - Date.prototype.toLocaleDateString: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

// Guidance and suggestions provided by ChatGPT for improving code readability and structure.