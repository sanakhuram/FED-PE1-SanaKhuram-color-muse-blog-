// script/shared/auth.js
export function getAccessToken() {
    return localStorage.getItem('accessToken');  
  }
  
export function updateHeader(username) {
    const authLinks = document.querySelector('.auth-links');
    if (authLinks) {
        if (username) {
            authLinks.innerHTML = `<span>Hi, ${username}</span> <button id="sign-out-button">Sign Out</button>`;
        } else {
           
            authLinks.innerHTML = `<a href="../account/login.html">Sign In</a> | <a href="../account/register.html">Register</a>`;
        }

        const signOutButton = document.querySelector('#sign-out-button');
        if (signOutButton) {
            signOutButton.addEventListener('click', signOut);
        }
    }
}


export function checkLoginStatus() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        const username = localStorage.getItem('username') || 'User';
        updateHeader(username);
    } else {
        updateHeader(); 
    }
}

// Function to sign out the user
export function signOut() {

    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');

    updateHeader();

    // Redirect to the sign-in page or home page
    window.location.href = '../account/login.html'; 
}


document.addEventListener('DOMContentLoaded', checkLoginStatus);

