import AuthService from '../../api/services/authService';

export async function onRegister(event) {
  event.preventDefault(); // Prevent the default form submission

  const form = event.target; // Get the form that triggered the event
  const formData = new FormData(form); // Create a FormData object from the form
  const data = Object.fromEntries(formData.entries()); // Convert FormData to an object

  try {
    // Call the AuthService to register the user with all required fields
    const userData = await AuthService.register(data);

    // Handle successful registration
    if (userData.success) {
      // Redirect to the profile page or another desired route
      window.location.href = '/';
    } else {
      alert('Registration failed: ' + userData.message); // Handle error if registration fails
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred during registration. Please try again.'); // Display an error message to the user
  }
}
