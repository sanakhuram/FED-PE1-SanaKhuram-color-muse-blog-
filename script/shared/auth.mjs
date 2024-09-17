// script/shared/auth.js

// Retrieve the access token from localStorage
export function getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  
  // Update the header with user's status
  export function updateHeader(username) {
    const authLinks = document.querySelector('.auth-links');
    
    if (authLinks) {
      // If the username is provided, show the greeting and sign out button
      if (username) {
        authLinks.innerHTML = `<span>Hi, ${username}</span> <button id="sign-out-button">Sign Out</button>`;
      } else {
        // If no username, show Sign In and Register links
        authLinks.innerHTML = `<a href="../account/login.html">Sign In</a> | <a href="../account/register.html">Register</a>`;
      }
  
      // Handle the sign-out logic
      const signOutButton = document.querySelector('#sign-out-button');
      if (signOutButton) {
        signOutButton.addEventListener('click', signOut);
      }
    }
  }
  
  // Check if the user is signed in
  export function isUserSignedIn() {
    const accessToken = getAccessToken();
    return accessToken !== null;
  }
  
  // Handle user sign-out
  export function signOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');  // Clear the stored username
    window.location.href = '../account/login.html';  // Redirect to login page
  }
  
  // Check the login status and update the UI accordingly
  export function checkLoginStatus() {
    const username = localStorage.getItem('username');  // Retrieve stored username
    updateHeader(username);  // Call updateHeader to update the UI based on login state
  }
  