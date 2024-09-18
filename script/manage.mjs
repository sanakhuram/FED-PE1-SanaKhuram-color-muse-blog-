import { BLOG_POSTS_ALL, DELETE_POST_API_ENDPOINT } from './shared/api.mjs';
import { updateHeader, isUserSignedIn, checkLoginStatus } from './shared/auth.mjs'; 

async function fetchPosts() {
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
    }
}

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

    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = e.target.getAttribute('data-id');
            window.location.href = `../post/edit.html?id=${postId}`; 
        });
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const postId = e.target.getAttribute('data-id');
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

document.querySelector('.create-post-btn').addEventListener('click', () => {
    window.location.href = '../post/createPost.html';
});
