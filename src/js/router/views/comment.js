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
    commentsListContainer.innerHTML =
      '<p>No comments yet. Be the first to comment</p>';
  } else {
    const currentUser = getAuthUser();

    // Use .map() to generate the comments HTML
    const commentHTML = comments
      .map((comment) => {
        const formattedDate = formatDate(comment.created);
        const isAuthor =
          currentUser && currentUser.name === comment.author.name;

        return `
          <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-meta">
              <img class="author-avatar" src="${
                comment.author.avatar.url
              }" alt="${comment.author.avatar.alt}" />
              <div class="comment-content">
                <div class="comment-data-wrapper">
                  <div class="comment-user-inner">
                    <span class="comment-user"><small>${
                      comment.author.name
                    }</small></span>
                    <span class="comment-date"><small>${formattedDate}</small></span>
                    <div class="comment-info">
                      <div class="comment-body">
                        <p>${comment.body}</p>
                      </div>
                    </div>
                  </div>
                  <div class="comment-delete-btn">
                    ${
                      isAuthor
                        ? `<button class="delete-comment-btn btn btn-danger" data-comment-id="${comment.id}">Delete</button>`
                        : ''
                    }
                  </div>
                </div>
                <button class="reply-btn btn btn-outline" data-comment-id="${
                  comment.id
                }">Reply</button>
                <div class="replies-list"></div>
              </div>
            </div>
          </div>
        `;
      })
      .join(''); // Combine all comment HTML strings into one

    commentsListContainer.innerHTML = commentHTML;
  }

  // Append the new comments list to the comment container
  commentContainer.appendChild(commentsListContainer);

  // Add event listeners for delete buttons
  const deleteButtons = commentsListContainer.querySelectorAll(
    '.delete-comment-btn'
  );
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDeleteComment);
  });

  // Add event listeners for reply buttons to render reply box
  const replyButtons = commentsListContainer.querySelectorAll('.reply-btn');
  replyButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const commentId = event.target.getAttribute('data-comment-id');
      renderReplyBox(postId, commentId); // Calls function to render reply box
    });
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

export async function renderReplies(postId, commentId) {
  // Fetch comments instead of replies
  const comments = await fetchComments(postId);
  const commentElement = document.querySelector(`[data-comment-id="${commentId}"]`);

  // Filter out the replies for the specific commentId
  const replies = comments.filter(comment => comment.replyToId === commentId);

  // Find the replies container or create it if it doesn't exist
  let replyContainer = commentElement.querySelector('.replies-list');
  if (!replyContainer) {
    replyContainer = document.createElement('div');
    replyContainer.classList.add('replies-list');
    commentElement.appendChild(replyContainer);
  }

  // Generate HTML for the new replies
  const repliesHTML = replies.map(reply => `
    <div class="reply-item" data-reply-id="${reply.id}">
      <div class="reply-meta">
        <img class="author-avatar" src="${reply.author.avatar.url}" alt="${reply.author.avatar.alt}" />
        <div class="reply-content">
          <span class="reply-user">${reply.author.name}</span>
          <span class="reply-date"><small>${formatDate(reply.created)}</small></span>
          <p>${reply.body}</p>
        </div>
      </div>
    </div>
  `).join(''); // Combine all reply HTML strings into one

  // Clear existing replies to avoid duplication and append new replies
  replyContainer.innerHTML = repliesHTML;
}

export async function handleReplySubmit(postId, commentId, replyInput) {
  const replyBody = replyInput.value.trim();
  if (!replyBody) {
    console.error('Reply body is empty');
    return;
  }

  try {
    const result = await commentService.reply(postId, commentId, replyBody);
    if (result.success) {
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

export function renderReplyBox(postId, commentId) {
  const replyBoxHTML = `
    <div class="reply-box">
      <textarea class="reply-input" placeholder="Write a reply..."></textarea>
      <button class="reply-submit-button btn btn-solid" data-comment-id="${commentId}" data-post-id="${postId}">Reply</button>
    </div>
  `;
  const commentElement = document.querySelector(
    `[data-comment-id="${commentId}"]`
  );
  commentElement.insertAdjacentHTML('beforeend', replyBoxHTML);
}

export function handleReplyButtonClick(event) {
  if (event.target && event.target.classList.contains('reply-submit-button')) {
    const commentId = event.target.getAttribute('data-comment-id');
    const postId = event.target.getAttribute('data-post-id');
    const replyInput = document.querySelector(
      `[data-comment-id="${commentId}"] .reply-input`
    );

    if (commentId && replyInput) {
      handleReplySubmit(postId, commentId, replyInput);
    } else {
      console.error('Comment ID or reply input not found');
    }
  }
}

// Add event listeners for reply submission
document.body.addEventListener('click', handleReplyButtonClick);
