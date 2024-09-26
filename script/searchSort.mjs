import { displayBlogPosts } from './grid.mjs'; 

export function sortAndFilterPosts(blogPosts) {
    const sortByDate = document.getElementById('sort-filter').value;
    const sortByTitle = document.getElementById('sort-filter-title').value;
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const selectedTag = document.getElementById('tag-filter').value.toLowerCase();

    let filteredPosts = blogPosts;

    // Filter by search query (title)
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(searchQuery));
    }

    // Filter by selected tag
    if (selectedTag) {
        filteredPosts = filteredPosts.filter(post => post.tags && post.tags.includes(selectedTag));
    }

    // Sort by date
    if (sortByDate === 'latest') {
        filteredPosts.sort((a, b) => new Date(b.created) - new Date(a.created));
    } else if (sortByDate === 'oldest') {
        filteredPosts.sort((a, b) => new Date(a.created) - new Date(b.created));
    }

    // Sort by title (A-Z or Z-A)
    if (sortByTitle === 'title-asc') {
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortByTitle === 'title-desc') {
        filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Display the filtered and sorted posts
    displayBlogPosts(filteredPosts);
}


