import { BLOG_POSTS_API_ENDPOINT } from "./script/shared/api.mjs";
import { displayBlogPosts } from "./script/grid.mjs";  
import { setupCarousel } from "./script/carousel.mjs"; 
import { isUserSignedIn, updateHeader, checkLoginStatus } from "./script/shared/auth.mjs";
import { sortAndFilterPosts } from './script/searchSort.mjs';

let blogPosts = []; 

async function getAllBlogPosts() {
    try {
        const response = await fetch(BLOG_POSTS_API_ENDPOINT);
        if (!response.ok) {
            console.log("Error: API response is not OK.");
            return [];
        }
        const json = await response.json();
        console.log("API Response: ", json);
        return json;
    } catch (error) {
        console.error("Error fetching posts: ", error);
        return [];
    }
}

async function main() {
    const blogResponse = await getAllBlogPosts();
    blogPosts = Array.isArray(blogResponse.data) ? blogResponse.data : [];

    if (blogPosts.length > 0) {
        displayBlogPosts(blogPosts);  
        const lastThreePosts = blogPosts.slice(0, 3);  
        setupCarousel(lastThreePosts);  
        addSortAndSearchListeners();  
    } else {
        console.log("No blog posts found.");
    }
}


function addSortAndSearchListeners() {
    document.getElementById('sort-filter').addEventListener('change', () => sortAndFilterPosts(blogPosts));
    document.getElementById('sort-filter-title').addEventListener('change', () => sortAndFilterPosts(blogPosts));
    document.getElementById('search-bar').addEventListener('input', () => sortAndFilterPosts(blogPosts));
}

function showManagePostButton() {
    const managePostContainer = document.getElementById('manage-post-btn-container');
    const username = localStorage.getItem('username');

    if (isUserSignedIn() && username && username.toLowerCase() === 'sana') {
        const managePostButton = document.createElement('button');
        managePostButton.textContent = 'Manage Posts';
        managePostButton.classList.add('manage-post-btn');

        managePostButton.addEventListener('click', () => {
            window.location.href = '../post/manage.html';
        });

        managePostContainer.appendChild(managePostButton);
    } else {
        managePostContainer.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    main(); 
    showManagePostButton(); 
});
