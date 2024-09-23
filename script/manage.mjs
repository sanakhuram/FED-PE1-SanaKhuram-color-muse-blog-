import { BLOG_POSTS_ALL, DELETE_POST_API_ENDPOINT } from './shared/api.mjs';
import { updateHeader, checkLoginStatus } from './shared/auth.mjs'; 
import { showLoader, hideLoader } from './shared/loader.mjs';  

//Fetch all blog posts

async function fetchPosts() {
    showLoader(); 
    try {
        const response = await fetch(BLOG_POSTS_ALL); 
        if (!response.ok) {
            throw new Error('Error fetching posts.');
        }
        const posts = await response.json();
        return posts.data; 
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    } finally {
        hideLoader();  
    }
}

//Function Delete post by ID

async function deletePost(postId) {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    showLoader(); 
    try {
        const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete post.');
        }

        alert('Post deleted successfully.');
        window.location.reload(); 
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again later.');
    } finally {
        hideLoader();  
    }
}

//Function to Render blog posts in grid

function renderPosts(posts) {
    const postsContainer = document.querySelector('.post-grid'); 
    postsContainer.innerHTML = ''; 

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>'; 
        return;
    }

    posts.forEach((post) => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');

        postCard.innerHTML = `
            <div class="post-image">
                <a href="../post/index.html?id=${post.id}">
                    <img src="${post.media?.url || 'https://via.placeholder.com/150x100'}" alt="Post Image">
                </a>
            </div>
            <div class="post-title">
                <h3>${post.title}</h3>
            </div>
            <div class="post-buttons">
                <button class="edit-btn" data-id="${post.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <a href="../post/index.html?id=${post.id}" class="view-icon">
                    <i class="fas fa-eye"></i>
                </a>
                <button class="delete-btn" data-id="${post.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;

        postsContainer.appendChild(postCard);
    });

    //Event listeners for edit button
    
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = e.target.getAttribute('data-id');
            window.location.href = `../post/edit.html?id=${postId}`; 
        });
    });

    //Event listeners for delete button

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = e.target.getAttribute('data-id');
            console.log('Deleting post with ID:', postId);  
            deletePost(postId);  
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    checkLoginStatus();
    const username = localStorage.getItem('username');
    updateHeader(username);

    const posts = await fetchPosts();  
    renderPosts(posts);  
});

// Event listener for "Create Post" button

document.querySelector('.create-post-btn').addEventListener('click', () => {
    window.location.href = '../post/createPost.html';
});



// References 😊:
// Fetch API: Used for fetching data from the server. 🌐
// MDN Docs - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

// Local Storage: Storing user data like tokens locally. 🗃️
// MDN Docs - Window.localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

// Event Listeners: Attach event handlers to DOM elements like buttons. 🔗
// MDN Docs - addEventListener(): https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

// Guidance and suggestions provided by ChatGPT for improving code readability and structure.