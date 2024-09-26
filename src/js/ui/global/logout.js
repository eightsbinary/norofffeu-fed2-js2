// Function to set up a logout listener for a button
export function setLogoutListener() {
  const logoutButton = document.getElementById('logout-btn'); // Ensure this ID matches your HTML
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await onLogout(); // Call the onLogout function when the button is clicked
    });
  }
}
