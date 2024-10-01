import replyService from '../../api/services/replyService';
import { timeUtils } from '../../utilities/timeUtils';
import { fetchComments } from './comment'; // Import the fetchComments function
// import { timeUtils } from '../../utils/timeUtils'; // Assuming you have a timeUtils function for relative time formatting
timeUtils

// Fetch and render replies for a specific comment
export async function renderReplies(postId, commentId) {
  const repliesContainer = document.querySelector(`.comment-item[data-comment-id="${commentId}"] .replies-list`);

  // Check if repliesContainer exists
  if (!repliesContainer) {
    console.error(`Replies container not found for comment ID ${commentId}`);
    return;
  }

  try {
    const replies = await replyService.replies(postId, commentId); // Fetch replies for the specific comment
    console.log(222, replies);
    
    // Check if replies is an array
    if (!Array.isArray(replies)) {
      console.error('Error fetching replies: expected an array but got:', replies);
      return;
    }

    // Clear existing replies
    repliesContainer.innerHTML = '';

    // Generate replies HTML
    const repliesHTML = replies.map((reply) => {
      const relativeTime = timeUtils(reply.created);
      return `
        <div class="reply-item" data-reply-id="${reply.id}">
          <div class="reply-content">
            <span class="reply-user">${reply.author.name}</span>
            <span class="reply-date">${relativeTime}</span>
            <p>${reply.body}</p>
          </div>
        </div>
      `;
    }).join('');

    // Append new replies to the replies container
    repliesContainer.innerHTML = repliesHTML;
  } catch (error) {
    console.error('Error rendering replies:', error);
  }
}

// Handle reply submission
export async function handleReplySubmit(postId, commentId, replyInput) {
  const replyBody = replyInput.value.trim();
  if (!replyBody) {
    console.error('Reply body is empty');
    return;
  }

  try {
    const result = await replyService.add(postId, commentId, replyBody);
    if (result) {
      replyInput.value = ''; // Clear the reply input
      // Render replies after adding a new one
      await renderReplies(postId, commentId); // Call renderReplies to update the UI
    } else {
      console.error('Error adding reply:', result.error);
    }
  } catch (error) {
    console.error('Error adding reply:', error);
  }
}

// Render reply box UI
export function renderReplyBox(postId, commentId) {
  const replyBoxHTML = `
    <div class="reply-box">
      <textarea class="reply-input" placeholder="Write a reply..."></textarea>
      <button class="reply-submit-button btn btn-solid" data-comment-id="${commentId}" data-post-id="${postId}">Reply</button>
    </div>
  `;
  const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);
  commentElement.insertAdjacentHTML('beforeend', replyBoxHTML);
}

// Handle reply button click and submit reply
export function handleReplyButtonClick(event) {
  if (event.target && event.target.classList.contains('reply-submit-button')) {
    const commentId = event.target.getAttribute('data-comment-id');
    const postId = event.target.getAttribute('data-post-id');
    const replyInput = document.querySelector(`[data-comment-id="${commentId}"] .reply-input`);

    if (commentId && replyInput) {
      handleReplySubmit(postId, commentId, replyInput);
    } else {
      console.error('Comment ID or reply input not found');
    }
  }
}

// Add event listener for reply submission
document.body.addEventListener('click', handleReplyButtonClick);
