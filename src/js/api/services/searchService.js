import searchRepository from '../repositories/searchRepository';

class SearchService {
  async post(query, page = 1, limit = 12) { // Added page parameter
    try {
      const response = await searchRepository.post(query, limit, page); // Pass page as an argument
      return { success: true, data: response || [] };
    } catch (error) {
      console.error('Error in SearchService (search):', error);
      return { success: false, error: error.message };
    }
  }
}

export default new SearchService();
