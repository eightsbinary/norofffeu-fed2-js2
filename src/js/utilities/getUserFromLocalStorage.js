export function getUserFromLocalStorage() {
  const user = localStorage.getItem('user');
  
  // Check if the user data exists and parse it
  if (user) {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  console.warn('No user data found in localStorage');
  return null;
}
