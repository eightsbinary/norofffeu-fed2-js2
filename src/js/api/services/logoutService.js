// services/logoutService.js
class LogoutService {
  // Method to handle logout
  async logout() {
    // Clear tokens and user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    console.log('User has been logged out');
    // Optionally, send a request to the server to invalidate the session
    // await apiLogout(); // Uncomment if needed
    
  }
}

export default new LogoutService();
