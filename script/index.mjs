import { BLOG_POSTS_ALL } from "./shared/api.mjs";
import { displayBlogPosts } from "./grid.mjs";
import { setupCarousel } from "./carousel.mjs";
import { isUserSignedIn, updateHeader, checkLoginStatus } from "./shared/auth.mjs";
import { sortAndFilterPosts } from './searchSort.mjs';
import { displayPaginatedPosts } from './pagination.mjs'; 
import { showLoader, hideLoader } from "./shared/loader.mjs";

let blogPosts = [];

// Fetch all the blog posts from API

async function getAllBlogPosts() {
    try {
        const response = await fetch(BLOG_POSTS_ALL);
        if (!response.ok) {
            return [];
        }
        const json = await response.json();
        return json;
    } catch (error) {
        return [];
    }
}
// Main function to load data and setup the page
async function main() {
    showLoader();
    const blogResponse = await getAllBlogPosts();
    blogPosts = Array.isArray(blogResponse.data) ? blogResponse.data : [];

    if (blogPosts.length > 0) {
        displayPaginatedPosts(blogPosts, displayBlogPosts); 
        const lastThreePosts = blogPosts.slice(0, 3);
        setupCarousel(lastThreePosts);
        addSortAndSearchListeners();
    }
    hideLoader();
}
// Add listeners for sorting, searching, and filtering blog posts

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
// Show "Manage Posts" button only for signed-in admin
function showManagePostButton() {
    const managePostContainer = document.getElementById('manage-post-btn-container');
    const username = localStorage.getItem('username'); 
    if (isUserSignedIn() && username === 'colorMuse') {
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

// When the DOM is fully loaded, initialize functions
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    main(); 
    showManagePostButton();
});


// References 😊:
// - code inspired by the tutorials on JavaScript and working with APIs, check out:
// - [Udemy ZTM JavaScript Course](https://www.udemy.com/course/the-complete-javascript-course/)
// - [YouTube Tutorial on Fetch API](https://www.youtube.com/watch?v=cuEtnrL9-H0)
// -  Guidance and suggestions provided by ChatGPT for improving code readability and structure.