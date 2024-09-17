import { BLOG_POSTS_API_ENDPOINT } from "./script/shared/api.mjs";
import { displayBlogPosts } from "./script/grid.mjs";  
import { setupCarousel } from "./script/carousel.mjs"; 

// Fetch blog posts from API
async function getAllBlogPosts() {
    try {
        const response = await fetch(BLOG_POSTS_API_ENDPOINT);
        if (!response.ok) {
            console.log("Error: API response is not OK.");
            return [];
        }
        const json = await response.json();
        console.log("API Response: ", json); // Log the API response for debugging
        return json;
    } catch (error) {
        console.error("Error fetching posts: ", error);
        return [];
    }
}

async function main() {
    const blogResponse = await getAllBlogPosts();
    const blogPosts = Array.isArray(blogResponse.data) ? blogResponse.data : []; // Ensure data is an array

    if (blogPosts.length > 0) {
        displayBlogPosts(blogPosts);  
        const lastThreePosts = blogPosts.slice(0, 3);  
        setupCarousel(lastThreePosts);  
    } else {
        console.log("No blog posts found.");
    }
}

// Call the main function to execute the logic
main();
