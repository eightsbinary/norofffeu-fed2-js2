import postRepository from '../repositories/postRepository';

class PostService {
  // Create a new post
  async create(postData) {
    try {
      const response = await postRepository.create(postData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in PostService (create):', error);
      return { success: false, message: error.message };
    }
  }

  // Get a post by ID
  async post(id) {
    try {
      const response = await postRepository.post(id);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in PostService (post):', error);
      return { success: false, message: error.message };
    }
  }

  // Update a post by ID
  async update(id, postData) {
    try {
      const response = await postRepository.update(id, postData);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in PostService (update):', error);
      return { success: false, message: error.message };
    }
  }

  // Delete a post by ID
  async delete(id) {
    try {
      const response = await postRepository.delete(id);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in PostService (delete):', error);
      return { success: false, message: error.message };
    }
  }

  // Get all posts
  async getAll(page = 1) {
    try {
      const response = await postRepository.getAll(page);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in PostService (getAll):', error);
      return { success: false, message: error.message };
    }
  }
}

export default new PostService();
