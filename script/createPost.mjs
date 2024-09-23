import { getAccessToken } from '../../script/shared/accessToken.mjs';
import { BLOG_POSTS_ALL } from "../../script/shared/api.mjs";

// Select form elements ✍️
const postForm = document.querySelector('.postFormContainer'); 
const postTitleInput = document.getElementById('postTitleForm'); 
const postContentInput = document.getElementById('postContentForm'); 
const imageUrlInput = document.getElementById('imageURL'); 
const imageAltTextInput = document.getElementById('imageAltText');
const tagsInput = document.getElementById('tagsInput'); 

// Update character counter 📏
postContentInput.addEventListener('input', () => {
    const characterCount = postContentInput.value.length;
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `${characterCount}/10000`;
});

// Handle form submission 📝
postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!postTitleInput.value.trim() || !postContentInput.value.trim()) {
        alert('Title and content are required! 🚨');
        return;
    }

    const tagsArray = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag !== "");

    const newPost = {
        title: postTitleInput.value.trim(),
        body: postContentInput.value.trim(),
        media: {
            url: imageUrlInput.value.trim(),
            alt: imageAltTextInput.value.trim() || 'Post Image'
        },
        tags: tagsArray, 
    };

    try {
        await saveToAPI(newPost); // Save the post to the API 📡
        window.location.href = '../index.html'; // Redirect to homepage 🏡
    } catch (error) {
        alert('Failed to save the post to the server. Please try again later. 😞');
    }
});

// Function to save the post to the API 🌐
async function saveToAPI(post) {
    const blogData = {
        title: post.title,
        body: post.body,
        media: {
            url: post.media.url,
            alt: post.media.alt, 
        },
        tags: post.tags, 
    };

    try {
        const accessToken = getAccessToken(); // Get access token 🔑
        const options = {
            method: 'POST', // HTTP POST request ✉️
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(blogData),
        };
        const response = await fetch(BLOG_POSTS_ALL, options); // Send request to API 🚀
        if (!response.ok) {
            throw new Error('Failed to save post to the API');
        }
    } catch (error) {
        console.error('Error saving post to API:', error); // Log the error ⚠️
        throw error;
    }
}


// References 😊:
// Fetch API: Handles HTTP requests in JavaScript. 🌐
// MDN Docs - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

// Form Handling: Manages form submissions and validation. ✍️
// MDN Docs - Form Data: https://developer.mozilla.org/en-US/docs/Web/API/FormData

// Local Storage: Stores and retrieves data in the browser. 🗃️
// MDN Docs - Local Storage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

// Async/Await: Handles asynchronous operations in JavaScript. ⏳
// MDN Docs - Async/Await: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
// ChatGPT - For error handling and helping in overall coding ❤️