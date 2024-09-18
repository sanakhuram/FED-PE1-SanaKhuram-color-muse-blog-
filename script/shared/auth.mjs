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
  

  export function isUserSignedIn() {
    const accessToken = getAccessToken();
    return accessToken !== null;
  }
  
  export function signOut() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');  
    window.location.href = '../account/login.html';  
  }
  

  export function checkLoginStatus() {
    const username = localStorage.getItem('username');  
    updateHeader(username);  
  }

