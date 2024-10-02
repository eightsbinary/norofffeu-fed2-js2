import { authGuard } from '../../utilities/authGuard';
import followService from '../../api/services/followService';
import { getUserFromLocalStorage } from '../../utilities/getUserFromLocalStorage';
import profileService from '../../api/services/profileService';
import { formatDate } from '../../utilities/dateUtils';
import { formatTags } from '../../utilities/tagUtils';
import { checkFollowingAndInitialize } from '../views/follow'

authGuard();

const localUser = getUserFromLocalStorage();

// Function to extract username from URL
function getUsernameFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('username');
}

const urlUsername = getUsernameFromUrl();

async function fetchAndRenderProfile(username) {
  try {
    const response = await followService.checkFollowing(username);
    const data = response.data;

    if (data.data) {
      const profileData = data.data;
      renderProfile(profileData);
      await fetchAndRenderPosts(username); // Fetch and render posts after profile is loaded

      // Initialize the follow button logic
      if (profileData.name !== localUser.name) {
        checkFollowingAndInitialize(profileData.name); // Initialize the follow button with correct status
      }
    } else {
      console.error('Error fetching profile:', data.meta.message);
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
  fetchAndRenderPosts(localUser.name); // Fetch and render posts for local user
}

function renderProfile(user) {
  const profileContainer = document.querySelector('.profile-container');
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
    ${
      user.name !== localUser.name
        ? `<button id="followBtn" class="btn btn-outline">Loading...</button>`
        : `<button class="btn btn-solid" id="updateProfileBtn">Edit Profile</button>`
    }
  `;

  // Insert the generated HTML into the profile-container
  profileContainer.innerHTML += profileHTML; // Append after the overlay

  // Only initialize the follow button logic if viewing another user's profile
  if (user.name !== localUser.name) {
    checkFollowingAndInitialize(user.name); // Initialize correctly
  }

  attachButtonListeners(user.name);
}

// Function to fetch and render posts by the profile
async function fetchAndRenderPosts(username) {
  try {
    const { success, data } = await profileService.getPostsByProfile(username);
    if (success) {
      renderPosts(data.data);
    } else {
      console.error('Error fetching posts:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderPosts(posts) {
  const postListContainer = document.querySelector('.post-list');
  // Check if post-list container exists
  if (!postListContainer) {
    console.error('Post list container not found!');
    return;
  }

  // Generate HTML for each post
  const postElements = posts.map((post) => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    const formattedDate = formatDate(post.created);
    const formattedTags = formatTags(post.tags);

    postElement.innerHTML = `
    <div class="post-meta">
      <a class="profile-link" href="/profile/?username=${post.owner}">
        <img class="author-avatar" src="${post.author.avatar.url}" alt="${post.author.avatar.alt}" />
      </a>
      <div class="post-info">
        <a class="profile-link" href="/profile/?username=${post.owner}"><span class="mb--1"><small>${post.owner}</small></span></a>
        <span><small>${formattedDate}</small></span>
      </div>
    </div>
    <a class="post-details-link" href="/post/?id=${post.id}">
      <h2>${post.title}</h2>
    </a>
    <p class="tags-container">${formattedTags}</p>
    `;

    return postElement;
  });

  postListContainer.append(...postElements);

  attachButtonListeners(localUser.name);
}

function attachButtonListeners(username) {
  const updateBtn = document.getElementById('updateProfileBtn');
  if (!updateBtn) {
    return;
  }

  updateBtn.addEventListener('click', () => handleUpdateProfile(username));
}

// Redirect to the update post page
function handleUpdateProfile(username) {
  window.location.href = `/profile/edit/?username=${username}`;
}
