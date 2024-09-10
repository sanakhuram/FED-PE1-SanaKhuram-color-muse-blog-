//authDisplay.mjs
import { getAccessToken } from "./accessToken.mjs";

export function isUserSignedIn() {
    const accessToken = getAccessToken();
    return accessToken !== null; 
}


export function toggleCreatePostButton() {
    const createPostButton = document.querySelector('.create-post-btn'); 

    if (createPostButton) { 
        if (isUserSignedIn()) {
         
            createPostButton.style.display = 'block';
        } else {
            createPostButton.style.display = 'none';
        }
    } else {
        console.error('Create post button not found in the DOM');
    }
}
