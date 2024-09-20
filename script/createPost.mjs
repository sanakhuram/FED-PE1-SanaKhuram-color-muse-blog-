import { getAccessToken } from '../../script/shared/accessToken.mjs';
import { BLOG_POSTS_ALL } from "../../script/shared/api.mjs";

// Select form elements
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
        alert('Title and content are required!');
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
        await saveToAPI(newPost);
        window.location.href = '../index.html';
    } catch (error) {
        alert('Failed to save the post to the server. Please try again later.');
    }
});

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
        const accessToken = getAccessToken();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(blogData),
        };
        const response = await fetch(BLOG_POSTS_ALL, options);
        if (!response.ok) {
            throw new Error('Failed to save post to the API');
        }
    } catch (error) {
        console.error('Error saving post to API:', error);
        throw error;
    }
}
