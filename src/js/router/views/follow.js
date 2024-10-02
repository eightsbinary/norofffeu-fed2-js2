import followService from '../../api/services/followService';
import { getUserFromLocalStorage } from '../../utilities/getUserFromLocalStorage';

const localUser = getUserFromLocalStorage();

// Initialize the follow button
export function initializeFollowButton(username, isFollowing) {
  const followBtn = document.getElementById('followBtn');

  if (followBtn) {
    // Set initial button text based on following status
    followBtn.textContent = isFollowing ? 'Unfollow' : 'Follow';

    // Add click event listener
    followBtn.addEventListener('click', async () => {
      try {
        if (isFollowing) {
          // Unfollow user
          const response = await followService.unfollow(username);
          if (response.success) {
            followBtn.textContent = 'Follow'; // Update button text
            isFollowing = false; // Update follow state
            console.log('Unfollowed successfully');
            forceReloadWhenClickFollowBtn();
          } else {
            console.error('Failed to unfollow:', response.message);
          }
        } else {
          // Follow user
          const response = await followService.follow(username);
          if (response.success) {
            followBtn.textContent = 'Unfollow'; // Update button text
            isFollowing = true; // Update follow state
            console.log('Followed successfully');
            forceReloadWhenClickFollowBtn();
          } else {
            console.error('Failed to follow:', response.message);
          }
        }
      } catch (error) {
        console.error('Error while following/unfollowing:', error);
      }
    });
  }
}

function forceReloadWhenClickFollowBtn() {
  // Redirect to the same URL to force a reload
  window.location.href = `/`; // Reloads the page by redirecting to the current URL
}

// Function to check following status and initialize button
export async function checkFollowingAndInitialize(profileUsername) {
  if (localUser.name === profileUsername) {
    // Hide the button if the user is viewing their own profile
    const followBtn = document.getElementById('followBtn');
    if (followBtn) {
      followBtn.style.display = 'none'; // Hide the follow button
    }
    return; // Exit the function
  }

  try {
    // Check if the local user follows the profile user
    const { success, data } = await followService.checkFollowing(
      localUser.name
    );
    if (success) {
      const followBtn = document.getElementById('followBtn');
      if (followBtn) {
        // Check if the profile user is in the following array
        const isFollowing = data.data.following.some(
          (followedUser) => followedUser.name === profileUsername
        );

        if (isFollowing) {
          followBtn.textContent = 'Unfollow';
          followBtn.classList.remove('btn-outline');
          followBtn.classList.add('btn-solid'); // Change to solid button style
          followBtn.onclick = async () => {
            followBtn.disabled = true; // Disable the button
            try {
              await followService.unfollow(profileUsername);
              followBtn.textContent = 'Follow';
              followBtn.classList.remove('btn-solid');
              followBtn.classList.add('btn-outline');
              forceReloadWhenClickFollowBtn();
            } catch (error) {
              console.error('Follow User Error:', error);
            }
            followBtn.disabled = false; // Re-enable the button after the operation
          };
        } else {
          followBtn.textContent = 'Follow';
          followBtn.classList.remove('btn-solid');
          followBtn.classList.add('btn-outline'); // Change to outline button style
          followBtn.onclick = async () => {
            followBtn.disabled = true; // Disable the button
            try {
              await followService.follow(profileUsername);
              followBtn.textContent = 'Unfollow';
              followBtn.classList.remove('btn-outline');
              followBtn.classList.add('btn-solid');
              forceReloadWhenClickFollowBtn();
            } catch (error) {
              console.error('Follow User Error:', error);
            }
            // Re-enable the button after the operation
            followBtn.disabled = false; 
            // Reload the page to reflect changes
          };
        }
      }
    } else {
      console.error('Error checking follow status:', data.message);
    }
  } catch (error) {
    console.error('Error checking follow status:', error);
  }
}

// Function to fetch and render following users
async function renderFollowingUsers() {
  try {
    const { success, data } = await followService.checkFollowing(localUser.name);
    if (success) {
      const followingUsers = data.data.following;
      const authorGrid = document.querySelector('.author-grid');

      if (authorGrid) {
        // Clear the grid before rendering
        authorGrid.innerHTML = '';

        // Use map to create user cards and join them into a single string
        const userCards = followingUsers.map(user => `
          <div class="author-item">
            <a class="profile-grid-link" href="/profile/?username=${user.name}">
              <div class="avatar-following-inner">
                <span class="avatar-following-wrapper">
                  <img src="${user.avatar.url}" alt="${user.avatar.alt}" class="author-avatar-following"/>
                </span>
                <h3 class="mb-3">${user.name}</h3>
              </div>
            </a>
          </div>
        `).join('');

        // <a href="/profile/?username=${user.name}" class="view-profile-btn">View Profile
        // Insert the user cards into the grid
        authorGrid.innerHTML = userCards;
      }
    } else {
      console.error('Error fetching following users:', data.message);
    }
  } catch (error) {
    console.error('Error fetching following users:', error);
  }
}

renderFollowingUsers();