import { GET_BLOG_POST_BY_ID, UPDATE_BLOG_POST_BY_ID, DELETE_POST_API_ENDPOINT } from './shared/api.mjs';


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

console.log('Post ID:', postId); 


const imageURLInput = document.getElementById('imageURL');
const postTitleInput = document.getElementById('postTitleForm');
const postContentInput = document.getElementById('postContentForm');
const deleteButton = document.querySelector('.deleteButtonEditPage');
const saveButton = document.querySelector('.post-button button');
const counterElement = document.getElementById('counter');

async function fetchPostData(postId) {
    try {
        const response = await fetch(GET_BLOG_POST_BY_ID(postId));
        if (!response.ok) {
            throw new Error('Failed to fetch post data');
        }
        const postData = await response.json();
        console.log('Fetched Post Data:', postData); 
        return postData;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}


async function loadPostForEditing() {
    if (!postId) {
        console.error('No post ID found in the URL'); 
        return;
    }

    const post = await fetchPostData(postId);
    if (post && post.data) {
        if (imageURLInput) imageURLInput.value = post.data.media?.url || '';
        if (postTitleInput) postTitleInput.value = post.data.title || '';
        if (postContentInput) postContentInput.value = post.data.body || '';
        updateCounter();
    } else {
        alert('Failed to load post data.');
    }
}


function updateCounter() {
    const contentLength = postContentInput?.value.length || 0; 
    if (counterElement) {
        counterElement.textContent = `${contentLength}/10000`;
    }
}
async function handleSaveChanges(e) {
    e.preventDefault();

    const updatedPostData = {
        title: postTitleInput?.value || '',
        body: postContentInput?.value || '',
        media: { url: imageURLInput?.value || '' },
    };

    console.log('Updated Post Data:', updatedPostData);

    try {
        const response = await fetch(UPDATE_BLOG_POST_BY_ID(postId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(updatedPostData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to update post: ${response.status} ${response.statusText} - ${errorText}`);
            alert(`Failed to update post. ${response.statusText}: ${errorText}`);
        } else {
            alert('Post updated successfully!');
            window.location.href = `../post/index.html?id=${postId}`;
        }
    } catch (error) {
        console.error('Error updating post:', error.message);
        alert(`Error updating post: ${error.message}`);
    }
}


async function handleDeletePost() {
    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(DELETE_POST_API_ENDPOINT(postId), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete post: ${response.status} ${response.statusText} - ${errorText}`);
        }

        alert('Post deleted successfully!');
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error deleting post:', error.message);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveChanges);
    } else {
        console.error('Save button not found.');
    }

    if (deleteButton) {
        deleteButton.addEventListener('click', handleDeletePost);
    } else {
        console.error('Delete button not found.');
    }

    loadPostForEditing(); 
});

if (postContentInput) {
    postContentInput.addEventListener('input', updateCounter); 
} else {
    console.error('Post content input not found.');
}
