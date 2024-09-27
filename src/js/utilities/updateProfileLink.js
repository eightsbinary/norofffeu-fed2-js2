export function updateProfileLink() {
  // Parse the user object from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.name) {
    console.error('No user found in localStorage');
    return;
  }

  // Get the profile link element by its ID
  const profileLink = document.getElementById('profile-link');

  if (profileLink) {
    // Update the href attribute to include the user's name
    profileLink.href = `/profile/?username=${user.name}`;
  } else {
    console.error('Profile link element not found');
  }
}
