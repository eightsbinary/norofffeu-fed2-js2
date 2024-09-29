import { API_SOCIAL_POSTS } from '../constants';
import { headers } from '../headers';

class CommentRepository {
  // Fetch comments for a post
  async comments(postId) {
    const url = `${API_SOCIAL_POSTS}/${postId}/?_comments=true&_author=true`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers()
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Comment Fetch Error:', error);
      throw error;
    }
  }

  // Add a comment to a post
  async add(postId, body) {
    const url = `${API_SOCIAL_POSTS}/${postId}/comment`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({body})
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add Comment Error:', error);
      throw error;
    }
  }

  // Delete a comment
  async delete(postId, commentId) {
    const url = `${API_SOCIAL_POSTS}/${postId}/comment/${commentId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers()
      });

      if (response.status === 204) {
        return { success: true, message: 'Comment deleted successfully.' };
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete Comment Error:', error);
      throw error;
    }
  }

  // Add a reply to a comment
  async reply(postId, commentId, body) {
    const url = `${API_SOCIAL_POSTS}/${postId}/comment/?author=true&_comments=true`;

  // Ensure commentId is a number
  const numericCommentId = Number(commentId);

  // Construct the payload with the replyToId as a number
  const payload = JSON.stringify({
    body,
    replyToId: numericCommentId // Using numeric commentId
  });

  console.log('Payload:', payload);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers(),
        body: payload
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Reply Comment Error:', error);
      throw error;
    }
  }

  // Fetch replies for a comment
  async fetchReplies(postId, commentId) {
    const url = `${API_SOCIAL_POSTS}/${postId}/comment/?author=true&_comments=true`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers()
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText}. Details: ${errorBody}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch Replies Error:', error);
      throw error;
    }
  }
}

export default new CommentRepository();
