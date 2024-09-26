import { BLOG_POSTS_ALL } from "./shared/api.mjs";
import { displayBlogPosts } from "./grid.mjs";
import { setupCarousel } from "./carousel.mjs";
import { isUserSignedIn, checkLoginStatus } from "./shared/auth.mjs";
import { displayPaginatedPosts } from './pagination.mjs'; 
import { showLoader, hideLoader } from "./shared/loader.mjs";
import { sortAndFilterPosts } from './searchSort.mjs';

let blogPosts = [];

async function getAllBlogPosts() {
    try {
        const response = await fetch(BLOG_POSTS_ALL);
        if (!response.ok) {
            throw new Error('Error fetching blog posts');
        }
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

function loadPostsFromLocalStorage() {
    const username = localStorage.getItem('username');
    if (!username) return [];
    return JSON.parse(localStorage.getItem(`posts_${username}`)) || [];
}

async function main() {
    showLoader();

    const username = localStorage.getItem('username');
    let filteredPosts = [];

    if (!isUserSignedIn() || username === 'colorMuse') {
        blogPosts = await getAllBlogPosts();
        filteredPosts = blogPosts;
    } else {
        const localPosts = loadPostsFromLocalStorage();
        filteredPosts = localPosts.filter(post => post.author === username);
    }

    if (filteredPosts.length > 0) {
        displayPaginatedPosts(filteredPosts, displayBlogPosts);
        const lastThreePosts = filteredPosts.slice(0, 3);
        setupCarousel(lastThreePosts);
        addSortAndSearchListeners();
    } else {
        document.querySelector(".blog-posts").innerHTML = "<p>No blog posts yet click on Manage Posts to get started😊.</p>";
    }

    hideLoader();
}

function addSortAndSearchListeners() {
    document.getElementById('sort-filter').addEventListener('change', async () => {
        showLoader();
        await sortAndFilterPosts(blogPosts);
        hideLoader();
    });

    document.getElementById('sort-filter-title').addEventListener('change', async () => {
        showLoader();
        await sortAndFilterPosts(blogPosts);
        hideLoader();
    });

    document.getElementById('search-bar').addEventListener('input', async () => {
        showLoader();
        await sortAndFilterPosts(blogPosts);
        hideLoader();
    });

    document.getElementById('tag-filter').addEventListener('change', async () => {
        showLoader();
        await sortAndFilterPosts(blogPosts);
        hideLoader();
    });
}

function showManagePostButton() {
    const managePostContainer = document.getElementById('manage-post-btn-container');
    const username = localStorage.getItem('username'); 

    if (isUserSignedIn()) {
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

