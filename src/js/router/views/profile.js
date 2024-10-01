import { authGuard } from "../../utilities/authGuard";
import { updateProfileLink } from "../../utilities/updateProfileLink";
import { getUserFromLocalStorage } from "../../utilities/getUserFromLocalStorage";
import profileService from '../../api/services/profileService';

authGuard();
updateProfileLink();

const localUser = getUserFromLocalStorage();

// Function to extract username from URL
function getUsernameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('username');
}

const urlUsername = getUsernameFromUrl();

async function fetchAndRenderProfile(username) {
  try {
    const { success, data } = await profileService.profile(username);
    if (success) {
      renderProfile(data.data);
    } else {
      console.error('Error fetching profile:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Compare URL username with localStorage user
if (urlUsername && urlUsername !== localUser.name) {
  // Fetch and render profile for the URL username
  fetchAndRenderProfile(urlUsername);
} else {
  // Render the local user profile
  renderProfile(localUser);
}

function renderProfile(user) {
  const profileContainer = document.querySelector('.profile-container');
  // Check if profile container exists
  if (!profileContainer) {
    console.error('Profile container not found!');
    return;
  }

  // Set banner image as background of the profile-container
  profileContainer.style.backgroundImage = `url(${user.banner.url})`;

  // Create an overlay div for the background
  const overlay = document.createElement('div');
  overlay.classList.add('profile-overlay');
  profileContainer.appendChild(overlay);

  // Generate the profile HTML
  const profileHTML = `
    <header class="profile-header">
      <div class="profile-header__top">
        <span class="avatar-3xl">
          <img class="profile-avatar" src="${user.avatar.url}" alt="${user.avatar.alt || `${user.name}'s avatar`}">
        </span>
      </div>
      <div class="profile-header__details">
        <div class="profile__username mb-2">
          <h2>${user.name}</h2>
        </div>
        <div class="profile___bio mb-3">
          <p class="profile__bio-text">${user.bio || 'No bio available'}</p>
        </div>
      </div>
    </header>
    <form name="updateProfile">
      <button class="btn btn-solid" id="updateProfileBtn">Edit Profile</button>
    </form>
  `;

  // Insert the generated HTML into the profile-container
  profileContainer.innerHTML += profileHTML; // Append after the overlay
}
