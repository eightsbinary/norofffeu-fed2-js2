import { API_SOCIAL_POSTS } from '../constants';
import { headers } from '../headers';

class ReplyRepository {
  // Fetch replies for a comment
  async replies(postId) {
    const url = `${API_SOCIAL_POSTS}/${postId}/?_comments=true&_author=true`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: headers(),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API error: ${response.status} ${response.statusText}. Details: ${errorBody}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Comment Fetch Error:', error);
      throw error;
    }
  }

  // Add a reply to a comment
  async add(postId, commentId, body) {
    const url = `${API_SOCIAL_POSTS}/${postId}/comment/`;

    // Ensure commentId is a number
    const numericCommentId = Number(commentId);

    // Construct the payload with the replyToId as a number
    const payload = JSON.stringify({
      body,
      replyToId: numericCommentId,
    });

    console.log('Payload:', payload);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers(),
        body: payload,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `API error: ${response.status} ${response.statusText}. Details: ${errorBody}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Reply Comment Error:', error);
      throw error;
    }
  }
}

export default new ReplyRepository();
