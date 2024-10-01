import { authGuard } from "../../utilities/authGuard";
import profileService from "../../api/services/profileService";
import { onUpdateProfile } from "../../ui/profile/update";

authGuard();

// Fetch and populate the profile data into the form
async function fetchAndUpdateProfile() {
  const username = new URLSearchParams(window.location.search).get('username');
  
  if (!username) {
    console.error('No username provided in the URL');
    return;
  }

  try {
    const result = await profileService.profile(username); // Fetch the profile
    if (result.success) {
      populateForm(result.data.data); // Populate form with fetched data
    } else {
      console.error('Failed to fetch profile:', result.message);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
}

// Populate form fields with the fetched profile data
function populateForm(profile) {
  const form = document.forms['updateProfile'];
  form.avatarUrl.value = profile.avatar?.url || ''; // Handle avatar URL
  form.avatarAlt.value = profile.avatar?.alt || ''; // Handle avatar alt text
  form.bannerUrl.value = profile.banner?.url || ''; // Handle banner URL
  form.bannerAlt.value = profile.banner?.alt || ''; // Handle banner alt text
}

// Initialize fetch on page load
fetchAndUpdateProfile();

// Attach the event listener for form submission
document.getElementById('UpdateProfileBtn').addEventListener('click', async (event) => {
  const username = new URLSearchParams(window.location.search).get('username');

  if (!username) {
    console.error('No username found in the URL');
    alert('Error: No username found. Please try again.');
    return;
  }

  await onUpdateProfile(username, event); // Handle the update on click
});

// Handle the cancel button click
function handleCancelBtn(event) {
  event.preventDefault(); // Prevent form submission
  window.location.href = '/'; // Redirect to homepage or desired page
}

// Add event listener to the cancel button
document.getElementById('cancelProfileUpdateBtn').addEventListener
('click', handleCancelBtn);
