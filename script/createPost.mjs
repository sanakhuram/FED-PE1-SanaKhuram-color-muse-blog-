import { getAccessToken } from '../../script/shared/accessToken.mjs';
import { BLOG_POSTS_API_ENDPOINT } from "../../script/shared/api.mjs";

// Select elements
const postForm = document.querySelector('.postFormContainer');
const postTitleInput = document.getElementById('postTitleForm');
const postContentInput = document.getElementById('postContentForm');
const imageUrlInput = document.getElementById('imageURL');
const counterDisplay = document.getElementById('counter');

// Update character counter function
function updateCounter() {
    const currentLength = postContentInput.value.length;
    counterDisplay.textContent = `${currentLength}/10000`;
}

// Attach the input event listener to the textarea
postContentInput.addEventListener('input', updateCounter);

postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!postTitleInput.value || !postContentInput.value) {
        alert('Title and content are required!');
        return;
    }

    const newPost = {
        id: Date.now(),
        title: postTitleInput.value,        
        content: postContentInput.value,    
        imageUrl: imageUrlInput.value,       
        created: new Date().toLocaleString(),
        updated: null,
        author: {
            "name": "currentUser.name"
        }
    };

    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push(newPost);

    try {
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
        console.error('Error saving post to LocalStorage:', error);
        alert('Failed to save post locally.');
        return;
    }

    try {
        await saveToAPI(newPost);
        window.location.href = '../index.html';  
    } catch (error) {
        alert('Failed to save the post to the server. Please try again later.');
    }
});

async function saveToAPI(post) {
    const blogData = {
        title: post.title,
        body: post.content,
        tags: [], 
        media: {
            url: post.imageUrl,
            alt: 'Post Image',
        },
    };

    try {
        const accessToken = getAccessToken();
        const options = {
            method: 'POST',
            body: JSON.stringify(blogData),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch(BLOG_POSTS_API_ENDPOINT, options);
        if (!response.ok) {
            throw new Error('Failed to save post to the API');
        }
        const result = await response.json();
        console.log(result);  // Log the response, handle if necessary
    } catch (error) {
        console.error('Error saving post to API:', error);
        throw error;  // Rethrow to handle in the calling function
    }
}
