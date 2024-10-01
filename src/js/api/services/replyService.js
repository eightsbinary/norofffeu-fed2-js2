import replyRepository from "../repositories/replyRepository";

class ReplyService {
  // Fetch all replies for a specific post's comment
  async replies(postId, commentId) {
    try {
      const repliesData = await replyRepository.replies(postId, commentId);

      // Log the full data structure for inspection
      console.log('Full repliesData:', repliesData);

      if (repliesData && repliesData.data && Array.isArray(repliesData.data.comments)) {
        // Log each comment for further inspection
        repliesData.data.comments.forEach((comment, index) => {
          console.log(`Comment ${index}:`, comment);
        });

        // Convert both replyToId and commentId to the same type (Number) for comparison
        const filteredReplies = repliesData.data.comments.filter(reply => {
          return Number(reply.replyToId) === Number(commentId);
        });

        // Log filtered replies for debugging
        console.log('Filtered Replies:', filteredReplies);

        return filteredReplies.length > 0 ? filteredReplies : [];
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
