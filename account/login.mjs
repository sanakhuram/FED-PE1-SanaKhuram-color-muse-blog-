import { LOGIN_API_ENDPOINT } from "../script/shared/api.mjs";
import { updateHeader } from "../script/shared/auth.mjs";

const loginForm = document.querySelector('#login-form');
const nameInput = document.querySelector('#name-input');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loginUser();
});

async function loginUser() {
  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const customOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    };

    // Send the login request to the API
    const response = await fetch(LOGIN_API_ENDPOINT, customOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);

    // Retrieve the access token from the response
    const newAccessToken = json.data.accessToken;
    
    // Store the access token and username in localStorage
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('username', name);

    // Update the header with the username
    updateHeader(name);

    // Redirect based on username
    if (name.toLowerCase() === 'sana') {
      window.location.href = '../post/manage.html'; // Redirect Sana to the manage page
    } else {
      window.location.href = '../index.html'; // Redirect other users to home or dashboard
    }

  } catch (error) {
    console.error('Error logging in:', error);
    alert('Login failed. Please check your credentials and try again.');
  }
}
