import commentRepository from "../repositories/commentRepository";

class CommentService {
  async comments(postId) {
    try {
      const response = await commentRepository.comments(postId);
      return { success: true, data: response || [] };
    } catch (error) {
      console.error('Error in CommentService (comments):', error);
      return { success: false, error: error.message };
    }
  }

  async add(postId, body) {
    try {
      const response = await commentRepository.add(postId, body);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in CommentService (add):', error);
      return { success: false, error: error.message };
    }
  }

  async delete(postId, commentId) {
    try {
      const response = await commentRepository.delete(postId, commentId);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in CommentService (delete):', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CommentService();
