// Get the access token from localStorage
export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

// Update the header based on the user's login status
export function updateHeader(username) {
  const authLinks = document.querySelector('.auth-links'); 

  if (authLinks) {
    // If the user is logged in, show username and sign-out button
    if (username) {
      authLinks.innerHTML = `<span>Hi, ${username}</span> <button id="sign-out-button">Sign Out</button>`;
    } else {
      // Otherwise, show the sign-in and register links
      authLinks.innerHTML = `<a href="../account/login.html">Sign In</a> | <a href="../account/register.html">Register</a>`;
    }

    // Add an event listener to the sign-out button if it exists
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

// Sign out the user 
export function signOut() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('username');
  window.location.href = '../account/login.html'; 
}

// Check login status and update the header when the page loads
export function checkLoginStatus() {
  const username = localStorage.getItem('username'); 
  updateHeader(username);
}

// Call checkLoginStatus() on page load
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus(); 
});
