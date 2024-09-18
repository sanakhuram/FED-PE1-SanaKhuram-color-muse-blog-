import { getAccessToken } from '../../script/shared/accessToken.mjs';
import { BLOG_POSTS_ALL } from "../../script/shared/api.mjs";
const postForm = document.querySelector('.postFormContainer'); 
const postTitleInput = document.getElementById('postTitleForm'); 
const postContentInput = document.getElementById('postContentForm'); 
const imageUrlInput = document.getElementById('imageURL'); 

postContentInput.addEventListener('input', () => {
    const characterCount = postContentInput.value.length;
    const counterElement = document.getElementById('counter');
    counterElement.textContent = `${characterCount}/10000`;
});
postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!postTitleInput.value || !postContentInput.value) {
        alert('Title and content are required!');
        return;
    }

    const newPost = {
        title: postTitleInput.value,
        body: postContentInput.value,
        imageUrl: imageUrlInput.value,
        media: { url: imageUrlInput.value, alt: 'Post Image' },
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
        media: { url: post.imageUrl, alt: 'Post Image' },
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

