import { getAuthUser } from '../../api/constants';
import commentService from '../../api/services/commentService';
import { formatDate } from '../../utilities/dateUtils';

export async function fetchComments(postId) {
  try {
    const result = await commentService.comments(postId);
    if (result.success) {
      console.log('Fetched comments:', result.data);
      return result.data.data.comments;
    } else {
      console.error('Failed to fetch comments:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export function renderCommentBox(postId) {
  const commentBoxHTML = `
    <div class="comment-box">
      <textarea class="comment-input" placeholder="Write a comment..."></textarea>
      <button id="commentSubmit" class="comment-submit-button btn btn-solid" data-post-id="${postId}">Comment</button>
    </div>
  `;
  
  const commentContainer = document.querySelector('.comment-container');
  
  // Check if comment box already exists
  const existingCommentBox = commentContainer.querySelector('.comment-box');
  if (existingCommentBox) {
    existingCommentBox.remove();
  }
  
  // Insert the new comment box at the beginning of the comment container
  commentContainer.insertAdjacentHTML('afterbegin', commentBoxHTML);
}

export async function renderComments(postId) {
  const comments = await fetchComments(postId);
  console.log('Fetched comments:', comments);
  const commentContainer = document.querySelector('.comment-container');
  
  // Clear existing comments
  const existingComments = commentContainer.querySelector('.comments-list');
  if (existingComments) {
    existingComments.remove();
  }

  // Create a new container for comments
  const commentsListContainer = document.createElement('div');
  commentsListContainer.className = 'comments-list';

  if (comments.length === 0) {
    commentsListContainer.innerHTML = '<p>No comments yet. Be the first to comment</p>';
  } else {
    const currentUser = getAuthUser();
    const commentHTML = comments
      .map((comment) => {
        const formattedDate = formatDate(comment.created);
        const isAuthor = currentUser && currentUser.name === comment.author.name;
        return `
          <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-meta">
              <img class="author-avatar" src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" />
              <div class="comment-content">
                <div class="comment-data-wrapper">
                  <div class="comment-user-inner">
                    <span class="comment-user"><small>${comment.author.name}</small></span>
                    <span class="comment-date"><small>${formattedDate}</small></span>
                  </div>
                  <div class="comment-delete-btn">
                    ${isAuthor ? `<button class="delete-comment-btn btn btn-danger" data-comment-id="${comment.id}">Delete</button>` : ''}
                  </div>
                </div>
                <div class="comment-info">
                  <div class="comment-boy">
                    <p>${comment.body}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          `;
      })
      .join(''); // Join all comments into a single HTML string
    commentsListContainer.innerHTML = commentHTML;
  }

  // Append the new comments list to the comment container
  commentContainer.appendChild(commentsListContainer);

  // Add event listeners for delete buttons
  const deleteButtons = commentsListContainer.querySelectorAll('.delete-comment-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', handleDeleteComment);
  });
}

export async function handleAddComment(postId, commentInput) {
  console.log('handleAddComment called');
  const commentBody = commentInput.value.trim();
  console.log('Comment body:', commentBody);
  if (!commentBody) {
    console.log('No comment body');
    return;
  }
  try {
    const result = await commentService.add(postId, commentBody);
    if (result.success) {
      commentInput.value = ''; // Clear the input box
      console.log('Comment added successfully, re-rendering comments');
      await renderComments(postId); // Re-render comments after adding a new one
    } else {
      console.error('Error adding comment:', result.error);
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}

async function handleDeleteComment(event) {
  const commentId = event.target.getAttribute('data-comment-id');
  const postId = getPostIdFromUrl(); // You need to implement this function to get the current post ID

  try {
    const result = await commentService.delete(postId, commentId);
    if (result.success) {
      console.log('Comment deleted successfully');
      // Re-render comments after deleting
      await renderComments(postId);
    } else {
      console.error('Error deleting comment:', result.error);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
}

// Helper function to get post ID from URL (implement this if not already present)
function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}
