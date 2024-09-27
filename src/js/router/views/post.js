import postService from '../../api/services/postService';
import { formatDate } from '../../utilities/dateUtils';
import { formatTags } from '../../utilities/tagUtils';
import { onDeletePost } from '../../ui/post/delete';
import { updateProfileLink } from '../../utilities/updateProfileLink';

updateProfileLink();

// Fetch and render the post
async function fetchAndRenderPost() {
  const postId = getPostIdFromUrl();
  
  if (!postId) {
    console.error('No post ID provided in the URL');
    return;
  }

  try {
    const result = await postService.post(postId);
    if (result.success) {
      const post = result.data.data;
      console.log(post)
      renderPost(post);
    } else {
      console.error('Failed to fetch post:', result.message);
    }
  } catch (error) {
    console.error('Error fetching post:', error);
  }
}

// Extract post ID from the URL
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Get current logged-in user from localStorage
function getCurrentUser() {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
}

// Render the post with conditionally shown buttons
function renderPost(post) {
  const postContainer = document.querySelector('.post-container');
  const currentUser = getCurrentUser();
  const isAuthor = currentUser && currentUser.name === post.author.name;

  const formattedDate = formatDate(post.created);
  const formattedTags = formatTags(post.tags);

  // Build the post HTML
  const postHTML = `
    <article class="single-post">
      ${post?.media ? `<img class="post-banner" src="${post?.media?.url}" alt="${post.title}" class="post-image">` : ''}
      <div class="post-content">
        <div class="post-meta">
          <div class="post-meta-inner">
            <img src="${post.author.avatar.url}" alt="${post.author.name}" class="author-avatar">
            <div class="post-info">
              <span class="author-name">${post.author.name}</span>
              <span class="post-date"><small>Posted on ${formattedDate}</small></span>
            </div>
          </div>
          <div class="btn-container mw-3 w-100">
            ${isAuthor ? renderEditDeleteButtons(post.id) : ''}
          </div>
        </div>
        <h1 class="post-title">${post.title}</h1>
        <div class="post-tags">${formattedTags}</div>
        <div class="post-body">${post.body}</div>
      </div>
    </article>
  `;

  postContainer.innerHTML = postHTML;

  if (isAuthor) {
    attachButtonListeners(post.id);
  }
}

// Render Edit and Delete buttons (only for the post author)
function renderEditDeleteButtons(postId) {
  return `
    <button id="editPost" class="btn btn-solid">Edit</button>
    <button id="deletePost" class="btn btn-solid btn-danger">-</button>
  `;
}

// Attach event listeners to the Edit and Delete buttons
function attachButtonListeners(postId) {
  const deleteBtn = document.getElementById('deletePost');
  const editBtn = document.getElementById('editPost');

  deleteBtn.addEventListener('click', () => handleDeletePost(postId));
  editBtn.addEventListener('click', () => handleUpdatePost(postId));
}

// Handle the delete post action
async function handleDeletePost(postId) {
  await onDeletePost(postId);
}

// Redirect to the update post page
function handleUpdatePost(postId) {
  window.location.href = `/post/edit/?id=${postId}`;
}

// Call the function to fetch and render the post when the script loads
fetchAndRenderPost();
