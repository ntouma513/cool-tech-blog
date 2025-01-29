const loginFormHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    // Get email and password values from the form
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    if (email && password) {
      try {
        // Send a POST request to the login endpoint
        const response = await fetch('/api/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          // Redirect to the homepage if login is successful
          document.location.replace('/');
        } else {
          // Show error message if login fails
          const result = await response.json();
          alert(result.message || 'Failed to log in.');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please enter both email and password.');
    }
  };
  
  // Attach event listener to the login form
  document
    .querySelector('#login-form')
    .addEventListener('submit', loginFormHandler);
  