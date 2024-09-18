// searchSort.mjs
import { displayBlogPosts } from "./grid.mjs";
export function sortAndFilterPosts(blogPosts) {
    const sortByDate = document.getElementById('sort-filter').value;
    const sortByTitle = document.getElementById('sort-filter-title').value;
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();

    let filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchQuery));

    if (sortByDate === 'latest') {
        filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else if (sortByDate === 'oldest') {
        filteredPosts.sort((a, b) => new Date(a.created) - new Date(b.created));
    }

    if (sortByTitle === 'title-asc') {
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortByTitle === 'title-desc') {
        filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
    }

    displayBlogPosts(filteredPosts); 
}

