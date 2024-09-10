//index.mjs
import { BLOG_POSTS_API_ENDPOINT } from "./script/shared/api.mjs";
import { toggleCreatePostButton } from "./script/shared/authDisplay.mjs";
import { displayBlogPosts } from "./script/grid.mjs";  
import { setupCarousel } from "./script/carousel.mjs"; 

// Fetch blog posts from API
async function getAllBlogPosts() {
    try {
        const response = await fetch(BLOG_POSTS_API_ENDPOINT);
        if (!response.ok) {
            return [];
        }
        const json = await response.json();
        return json;
    } catch (error) {
        return [];
    }
}

async function main() {
    const blogResponse = await getAllBlogPosts();
    const blogPosts = blogResponse.data || [];  

    if (blogPosts.length > 0) {
        displayBlogPosts(blogPosts);  
        const lastThreePosts = blogPosts.slice(0, 3);  
        setupCarousel(lastThreePosts);  
    }
}

document.addEventListener('DOMContentLoaded', () => {
    main(); 
    toggleCreatePostButton();  
});
displayBlogPosts();




// Error handling adapted from w3collective
// Display blog posts, inspired by Attacomsian
// Carousel setup based on w3collective's approach to handling subsets of data
// Refined code from ChatGPT








