import profileService from '../../api/services/profileService';

// Function to fetch and update localStorage with user data
async function fetchAndUpdateLocalStorage(username) {
  try {
    // Fetch the updated user data from the API using the existing profile method
    const userResult = await profileService.profile(username);

    if (userResult.success) {
      // Update localStorage with the new user data, only taking the data part
      console.log(111, userResult.data.data)
      localStorage.setItem('user', JSON.stringify(userResult.data.data)); // Store updated user data
      console.log('User data updated in localStorage:', userResult.data);
    } else {
      console.error('Failed to fetch user data:', userResult.message);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

// Function to handle updating the profile
export async function onUpdateProfile(username, event) {
  event.preventDefault(); // Prevent default form submission behavior

  // Target the correct form by its name
  const form = document.forms['updateProfile']; // Ensure this matches your form name

  if (!form) {
    console.error('Form element not found');
    return;
  }

  // Collect form data and convert it to an object
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Prepare the payload for the API (avatar and banner)
  const payload = {
    avatar: {
      url: data.avatarUrl, // Ensure these names match your input names
      alt: data.avatarAlt || '', // Optional alt text for avatar
    },
    banner: {
      url: data.bannerUrl,
      alt: data.bannerAlt || '', // Optional alt text for banner
    },
  };

  try {
    // Send the update request to the API
    const result = await profileService.update(username, payload);

    if (result.success) {
      console.log('Profile updated successfully:', result);
      alert('Profile updated successfully!'); // Notify the user

      // Fetch and update localStorage with the new user data
      await fetchAndUpdateLocalStorage(username);

      window.location.href = `/profile/?username=${username}`; // Redirect to profile page
    } else {
      console.error('Failed to update profile:', result.message);
      alert('Failed to update profile. Please try again.');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    alert('An error occurred while updating the profile.');
  }
}
