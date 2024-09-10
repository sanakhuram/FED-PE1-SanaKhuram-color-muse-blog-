//login.mjs
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

    const accessToken = localStorage.getItem('accessToken');

    try {
        const customOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
            }),
        };

        const response = await fetch(LOGIN_API_ENDPOINT, customOptions);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        
        const newAccessToken = json.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        // Store the username in localStorage if needed
        localStorage.setItem('username', name);

        // Update the header to "Welcome (username)"
        updateHeader(name);

        // Redirect to the home page
        window.location.href = '../index.html';

    } catch (error) {
        console.log('Error logging in:', error);
    }
}
