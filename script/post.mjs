import { BLOG_POSTS_API_ENDPOINT } from './shared/api.mjs';
import { updateHeader } from './shared/auth.mjs'; // Import the header update function

// Get the post ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// DOM elements for post content
const postTitle = document.getElementById('postHeaderTitle');
const postAuthor = document.getElementById('postAuthor');
const postImage = document.querySelector('.blogpage-image');
const postContent = document.getElementById('blogpost-text');
const postCreated = document.getElementById('publicationDate');
const postUpdated = document.getElementById('updatedTime');

// Function to fetch post by ID from the API
async function fetchPostById(postId) {
    try {
        const response = await fetch(`${BLOG_POSTS_API_ENDPOINT}/${postId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }

        const post = await response.json();
        console.log("Fetched Post Data:", post); // Inspect the response structure
        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

async function loadPost() {
    if (!postId) {
        console.error('Post ID is missing from URL');
        displayPostNotFound();
        return;
    }

    console.log("Post ID:", postId);  // Log the postId to check if it is correctly extracted

    const post = await fetchPostById(postId);

    if (post && post.data) {  // Access the post data inside the "data" field
        console.log("Post Data:", post.data);  // Log the fetched post data to check its structure

        // Set the title, image, and content
        postTitle.innerText = post.data.title || 'No title available';  // Access title inside post.data
        postImage.src = post.data.media?.url || post.data.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';
        postContent.innerText = post.data.body || 'No content available';

        // Set the author, created date, and updated date
        postAuthor.innerText = post.data.author?.name || 'Unknown Author';
        postCreated.innerText = post.data.created ? `Publication Date: ${new Date(post.data.created).toLocaleDateString()}` : 'Unknown';
        postUpdated.innerText = post.data.updated ? `Last Updated: ${new Date(post.data.updated).toLocaleDateString()}` : 'Not updated yet';

    } else {
        displayPostNotFound();
    }
}

// Handle case when post is not found
function displayPostNotFound() {
    postTitle.innerText = 'Post not found';
    postContent.innerText = 'No content available';
    postAuthor.innerText = 'Unknown Author';
    postCreated.innerText = 'Unknown';
    postUpdated.innerText = 'Not updated yet';
}

// Initialize post loading and update header when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username'); // Retrieve username from localStorage if available
    updateHeader(username);  
    loadPost(); 
});


document.getElementById("shareLink").addEventListener("click", function (e) {
    e.preventDefault();

    const postUrl = window.location.href;

    // Copy URL
    navigator.clipboard
        .writeText(postUrl)
        .then(() => {
            alert("Post URL copied to clipboard!");
        })
        .catch((err) => {
            alert("Could not copy the post URL. Please try again.");
        });
});
