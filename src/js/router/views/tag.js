import tagService from '../../api/services/tagService';
import { setupInfiniteScroll } from "../../utilities/scrollUtils";
import { renderTagResults, displayTagQuery } from "../../ui/tag/tag";

let currentPage = 1;
let currentTag = '';
let isLoading = false;
let totalPages = 1;

export function initializeTagPage() {
  const tag = getTagFromUrl();
  if (tag) {
    currentTag = tag;
    fetchTagRelatedPosts(currentTag); // Initial fetch
    setupInfiniteScroll(loadMoreTagPosts);
  }
}

// Function to extract the 'tag' query parameter from the URL
function getTagFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('tag');
}

// Function to fetch and render posts related to the tag
async function fetchTagRelatedPosts(tag, page = 1) {
  isLoading = true; // Set loading state
  try {
    const result = await tagService.tagRelatedPost(tag, page);
    if (result.success) {
      totalPages = result.data.meta.pageCount; // Update total pages based on response
      renderTagResults(result.data.data, page > 1); // Render results
      displayTagQuery(currentTag); // Display current tag
    } else {
      console.error('Tag fetch error:', result.message);
    }
  } catch (error) {
    console.error('Error fetching tag-related posts:', error);
  } finally {
    isLoading = false; // Reset loading state
  }
}

// Function to load more tag posts on scroll
async function loadMoreTagPosts() {
  if (currentPage < totalPages && !isLoading) {
    currentPage += 1; // Increment the page
    await fetchTagRelatedPosts(currentTag, currentPage); // Fetch the next page
  }
}

// Make sure to export the functions you want to use elsewhere
export { fetchTagRelatedPosts, loadMoreTagPosts };

// Call the initialization function
initializeTagPage();