// Ensure you're importing functions only once at the top
import { getAuthUser } from '../../api/constants';
import commentService from '../../api/services/commentService';
import replyService from '../../api/services/replyService';
import { formatDate } from '../../utilities/dateUtils';
import { renderReplies, renderReplyBox } from './reply';
import { timeUtils } from '../../utilities/timeUtils';

// Function to fetch comments from the API
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

// Function to render the comment input box for adding new comments
export function renderCommentBox(postId) {
  const commentBoxHTML = `
    <div class="comment-box">
      <textarea class="comment-input" placeholder="Write a comment..."></textarea>
      <div class="comment-btn-container">
        <button id="commentSubmit" class="comment-submit-button btn btn-solid" data-post-id="${postId}">Submit</button>
      </div>
    </div>
  `;

  const commentContainer = document.querySelector('.comment-container');

  // Remove any existing comment box
  const existingCommentBox = commentContainer.querySelector('.comment-box');
  if (existingCommentBox) {
    existingCommentBox.remove();
  }

  // Add the new comment box at the beginning of the container
  commentContainer.insertAdjacentHTML('afterbegin', commentBoxHTML);
}

// Function to render comments and replies (nested)
export async function renderComments(postId) {
  const comments = await fetchComments(postId);
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
    commentsListContainer.innerHTML =
      '<p>No comments yet. Be the first to comment</p>';
  } else {
    const currentUser = getAuthUser();

    // Function to render each comment/reply
    const renderComment = (comment, isReply = false) => {
      const relativeTime = timeUtils(comment.created);
      const isAuthor = currentUser && currentUser.name === comment.author.name;
      const commentClass = isReply ? 'reply-item' : 'comment-item';

      return `
        <div class="${commentClass}" data-comment-id="${comment.id}">
          <div class="comment-meta">
            <img class="author-avatar" src="${comment.author.avatar.url}" alt="${comment.author.avatar.alt}" />
            <div class="comment-content">
              <span class="comment-user">${comment.author.name}</span>
              <span class="comment-date">${relativeTime}</span>
              <p>${comment.body}</p>
              <div class="comment-btn-container">
                <div class="replies-list"></div> <!-- Placeholder for replies -->
                <div class="reply-button-container">
                  <button id="replyBtn" class="reply-btn btn btn-solid" data-comment-id="${comment.id}">Reply</button>
                  ${isAuthor ? `<button id="commentDeleteBtn" class="delete-comment-btn btn btn-danger" data-comment-id="${comment.id}">Delete</button>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    };

    // Render comments and replies
    const renderNestedComments = (comments, parentId = null) => {
      comments.forEach(comment => {
        if (comment.replyToId === parentId) {
          const commentHTML = renderComment(comment, parentId !== null);
          commentsListContainer.insertAdjacentHTML('beforeend', commentHTML);

          // Recursively render replies
          renderNestedComments(comments, comment.id);
        }
      });
    };

    // Call the function to render top-level comments and their replies
    renderNestedComments(comments);
  }

  // Append the new comments list to the comment container
  commentContainer.appendChild(commentsListContainer);

  // Add event listeners for reply buttons
  const replyButtons = commentsListContainer.querySelectorAll('.reply-btn');
  replyButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const commentId = event.target.getAttribute('data-comment-id');
      renderReplyBox(postId, commentId); // Render reply box when reply button is clicked
    });
  });

  // Add event listeners for delete buttons
  const deleteButtons = commentsListContainer.querySelectorAll('.delete-comment-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', handleDeleteComment); // Add event listener for deleting comment
  });
}

// Function to handle adding new comments
export async function handleAddComment(postId, commentInput) {
  const commentBody = commentInput.value.trim();
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

// Function to handle deleting comments
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

// Function to handle reply submission
export async function handleReplySubmit(postId, commentId, replyInput) {
  const replyBody = replyInput.value.trim();
  if (!replyBody) {
    console.error('Reply body is empty');
    return;
  }

  try {
    const result = await replyService.add(postId, commentId, replyBody);
    console.log(111, result);
    if (result.success) {
      replyInput.value = ''; // Clear the reply input
      // Render replies after adding a new one
      await renderReplies(postId, commentId); // Use the imported renderReplies function to update the UI
    } else {
      console.error('Error adding reply:', result.error);
    }
  } catch (error) {
    console.error('Error adding reply:', error);
  }
}