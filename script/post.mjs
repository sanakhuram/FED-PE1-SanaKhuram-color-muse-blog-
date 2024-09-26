import { GET_BLOG_POST_BY_ID } from './shared/api.mjs';
import { updateHeader } from './shared/auth.mjs';
import { showLoader, hideLoader } from './shared/loader.mjs';

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    displayPostNotFound();
    throw new Error('No post ID found in the URL');
}

const postTitle = document.getElementById('postHeaderTitle');
const postAuthor = document.getElementById('postAuthor');
const postImage = document.querySelector('.blogpage-image');
const postContent = document.getElementById('blogpost-text');
const postCreated = document.getElementById('publicationDate');
const postUpdated = document.getElementById('updatedTime');

function fetchPostFromLocalStorage(postId) {
    const username = localStorage.getItem('username');
    const posts = JSON.parse(localStorage.getItem(`posts_${username}`)) || [];
    return posts.find(post => post.id === Number(postId));
}

async function fetchPostByIdFromAPI(postId) {
    try {
        const response = await fetch(GET_BLOG_POST_BY_ID(postId));
        if (!response.ok) {
            throw new Error('Failed to fetch post');
        }
        const post = await response.json();
        return post.data; 
    } catch (error) {
        console.error('Error fetching post from API:', error);
        return null;
    }
}

async function loadPost() {
    showLoader();
    const username = localStorage.getItem('username');
    let post = null;

    try {
        if (!username || username === 'colorMuse') {
            post = await fetchPostByIdFromAPI(postId);
        } else {
            post = fetchPostFromLocalStorage(postId);

            if (!post) {
                post = await fetchPostByIdFromAPI(postId);
            }
        }

        if (post) {
           
            postTitle.innerText = post.title || 'No title available';
            postImage.src = post.media?.url || 'https://via.placeholder.com/600x400?text=No+Image';
            postContent.innerText = post.body || 'No content available';
            postAuthor.innerText = post.author?.name || 'Unknown Author';
            postCreated.innerText = post.created ? `Published on: ${new Date(post.created).toLocaleDateString()}` : 'Unknown';
            postUpdated.innerText = post.updated ? `Last updated on: ${new Date(post.updated).toLocaleDateString()}` : 'Not updated yet';
        } else {
            displayPostNotFound();
        }
    } catch (error) {
        console.error('Error loading post:', error);
        displayPostNotFound();
    } finally {
        hideLoader();
    }
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

const shareLink = document.getElementById('shareLink');
if (shareLink) {
    shareLink.addEventListener('click', function (e) {
        e.preventDefault();
        const postUrl = window.location.href;

        navigator.clipboard
            .writeText(postUrl)
            .then(() => {
                alert('Post URL copied to clipboard!');
            })
            .catch(() => {
                alert('Could not copy the post URL. Please try again.');
            });
    });
}
