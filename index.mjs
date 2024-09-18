import { BLOG_POSTS_ALL } from "./script/shared/api.mjs";
import { displayBlogPosts } from "./script/grid.mjs";
import { setupCarousel } from "./script/carousel.mjs";
import { isUserSignedIn, updateHeader, checkLoginStatus } from "./script/shared/auth.mjs";
import { sortAndFilterPosts } from './script/searchSort.mjs';
import { displayPaginatedPosts } from './script/pagination.mjs'; 

let blogPosts = [];

async function getAllBlogPosts() {
    try {
        const response = await fetch(BLOG_POSTS_ALL);
        if (!response.ok) {
            console.log("Error: API response is not OK.");
            return [];
        }
        const json = await response.json();
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
        displayPaginatedPosts(blogPosts, displayBlogPosts); 
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
        managePostButton.classList.add('manage-post-btn');

        managePostButton.innerHTML = '<i class="fas fa-tasks"></i> Manage Posts';

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
