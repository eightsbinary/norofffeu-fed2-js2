import replyRepository from "../repositories/replyRepository";

class ReplyService {
  // Fetch all replies for a specific post's comment
  async replies(postId, commentId) {
    try {
      const repliesData = await replyRepository.replies(postId, commentId);
      console.log(repliesData);
      
      // Check if repliesData has the expected structure
      if (repliesData && repliesData.data && Array.isArray(repliesData.data.comments)) {
        // Filter out the replies that are actually related to the specific comment
        return repliesData.data.comments.filter(reply => reply.replyToId === commentId);
      } else {
        console.error('Unexpected data structure:', repliesData);
        return [];
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
      return [];
    }
  }

  // Add a reply to a comment
  async add(postId, commentId, body) {
    try {
      const newReply = await replyRepository.add(postId, commentId, body);
      console.log('New reply added:', newReply);
      return newReply;
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  }
}

export default new ReplyService();