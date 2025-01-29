const signupFormHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission
  
    // Get name, email, and password values from the signup form
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value.trim();
  
    if (name && email && password) {
      try {
        // Send a POST request to the signup endpoint
        const response = await fetch('/api/users/signup', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (response.ok) {
          // Redirect to the homepage if signup is successful
          document.location.replace('/');
        } else {
          // Show error message if signup fails
          const result = await response.json();
          alert(result.message || 'Failed to sign up.');
        }
      } catch (error) {
        console.error('Error signing up:', error);
        alert('An error occurred. Please try again.');
      }
    } else {
      alert('Please fill out all fields.');
    }
  };
  
  // Attach event listener to the signup form
  document
    .querySelector('#signup-form')
    .addEventListener('submit', signupFormHandler);
  