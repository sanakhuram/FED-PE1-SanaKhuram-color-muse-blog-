// script/shared/auth.js
export function getAccessToken() {
    return localStorage.getItem('accessToken');
  }

// Update the header based on user's login status
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
  

// Check if the user is signed in by checking the access token

  export function isUserSignedIn() {
    const accessToken = getAccessToken();
    return accessToken !== null;
}
  
// Sign out the user by removing their token and username
  
  export function signOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');  
    window.location.href = '../account/login.html';  
  }
  
// Check if the user is logged in and update the header accordingly
  export function checkLoginStatus() {
    const username = localStorage.getItem('username');  
    updateHeader(username);  
  }

// References 😊:
// Help with structure and logic flow provided by ChatGPT