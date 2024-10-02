import tagRepository from "../repositories/tagRepository.js";

class TagService {
  async tagRelatedPost(tag, page = 1) {
    try {
      const response = await tagRepository.tagRelatedPost(tag, page);
      return { success: true, data: response };
    } catch (error) {
      console.error('Error in TagService (tagRelatedPost):', error);
      return { success: false, message: error.message };
    }
  }
}

export default new TagService();