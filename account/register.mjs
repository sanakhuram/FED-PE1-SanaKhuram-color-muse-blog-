import { REGISTER_API_ENDPOINT } from "../script/shared/api.mjs";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#register-form');
    const registerNameInput = document.querySelector('#name-input');
    const registerEmailInput = document.querySelector('#email-input');
    const registerPasswordInput = document.querySelector('#password-input');

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            registerUser();
        });
    }

    async function registerUser() {
        const name = registerNameInput.value;
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;

        if (!email.endsWith('@stud.noroff.no')) {
            alert('Please use a valid stud.noroff.no email address.');
            return;
        }

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

            const response = await fetch(REGISTER_API_ENDPOINT, customOptions);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! Status: ${response.status}, Error: ${errorText}`);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            console.log('Registration response:', json);
            alert('You are now registered. Redirecting to the sign-in page...');
            window.location.href = '../account/login.html'; 
        } catch (error) {
            console.error('Error during registration:', error);
            alert(`Error during registration: ${error.message}`);
        }
    }
});
