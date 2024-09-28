import { getAccessToken } from './shared/accessToken.mjs';
import { BLOG_POSTS_ALL } from './shared/api.mjs';

const postForm = document.querySelector('.postFormContainer'); 
const postTitleInput = document.getElementById('postTitleForm'); 
const postContentInput = document.getElementById('postContentForm'); 
const imageUrlInput = document.getElementById('imageURL'); 
const imageAltTextInput = document.getElementById('imageAltText');
const tagsInput = document.getElementById('tagsInput'); 

postContentInput.addEventListener('input', () => {
    const characterCount = postContentInput.value.length;
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `${characterCount}/10000`;
});
postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!postTitleInput.value.trim() || !postContentInput.value.trim()) {
        alert('Title and content are required! 🚨');
        return;
    }

    const tagsArray = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

    const newPost = {
        id: Date.now(),  
        title: postTitleInput.value.trim(),
        body: postContentInput.value.trim(),
        media: {
            url: imageUrlInput.value.trim(),
            alt: imageAltTextInput.value.trim() || 'Post Image'
        },
        tags: tagsArray,
        author: localStorage.getItem('username') || 'Anonymous',
        created: new Date().toISOString(),
    };

    try {
        if (newPost.author === 'colorMuse') {
            await saveToAPI(newPost);
        } else {
            saveToLocalStorage(newPost);
        }
        window.location.href = '../index.html'; 
    } catch (error) {
        alert('Failed to save the post. Please try again later.');
    }
});

async function saveToAPI(post) {
    const accessToken = getAccessToken();

    if (!accessToken) {
        throw new Error("User not authenticated");
    }

    const blogData = {
        title: post.title,
        body: post.body,
        media: {
            url: post.media.url,
            alt: post.media.alt,
        },
        tags: post.tags,
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(blogData),
    };

    const response = await fetch(BLOG_POSTS_ALL, options);
    if (!response.ok) {
        throw new Error('Failed to save post to the API');
    }
}

function saveToLocalStorage(post) {
    const username = localStorage.getItem('username');
    const postsKey = `posts_${username}`; 
    let posts = JSON.parse(localStorage.getItem(postsKey)) || [];
    posts.push(post);
    localStorage.setItem(postsKey, JSON.stringify(posts));

    console.log("Posts saved in LocalStorage:", posts); 
}

function loadPostsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('posts')) || [];
}

function deletePostFromLocalStorage(postId) {
    let posts = loadPostsFromLocalStorage();
    posts = posts.filter(post => post.id !== postId);
    localStorage.setItem('posts', JSON.stringify(posts));
}

postContentInput.addEventListener('input', () => {
    const characterCount = postContentInput.value.length;
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `${characterCount}/10000`;
});


