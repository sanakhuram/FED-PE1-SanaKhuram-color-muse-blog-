import { displayBlogPosts } from './grid.mjs'; 

export function sortAndFilterPosts(blogPosts) {
    const sortByDate = document.getElementById('sort-filter').value;
    const sortByTitle = document.getElementById('sort-filter-title').value;
    const searchQuery = document.getElementById('search-bar').value.toLowerCase();
    const selectedTag = document.getElementById('tag-filter').value.toLowerCase();

    console.log('Selected Tag:', selectedTag);

    // Filter by search query (title) first
    let filteredPosts = blogPosts.filter(post => post.title.toLowerCase().includes(searchQuery));

    // Filter by the selected tag
    if (selectedTag) {
        filteredPosts = filteredPosts.filter(post => {
            const tagsArray = Array.isArray(post.tags) 
                ? post.tags.map(tag => tag.toLowerCase()) 
                : post.tags.split(',').map(tag => tag.trim().toLowerCase()); 
            return tagsArray.includes(selectedTag);
        });
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

    console.log("Filtered and sorted posts: ", filteredPosts); 
    displayBlogPosts(filteredPosts);
}





