import LogoutService from '../../api/services/logoutService';

// Function for programmatic logout
export async function onLogout() {
  await LogoutService.logout(); // Execute the logout service
  // Redirect to the login page or update the UI accordingly
  window.location.href = '/'; // Adjust the redirect as necessary
}
