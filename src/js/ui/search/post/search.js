import searchService from '../../../api/services/searchService';
import { formatDate } from '../../../utilities/dateUtils';
import { formatTags } from '../../../utilities/tagUtils';
import { setupInfiniteScroll } from '../../../utilities/scrollUtils';

let currentQuery = '';
let currentPage = 1;
let totalPages = 1;
let isLoading = false;

document.addEventListener('DOMContentLoaded', () => {
  const query = getQueryFromUrl();
  
  if (query) {
    currentQuery = query;
    performSearch(query);  // Pass the extracted query to performSearch
  }
});

// Function to extract the 'q' query parameter from the URL
function getQueryFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  return query;
}

// Function to perform the search using the extracted query
async function performSearch(query, page = 1) {
  if (query) {
    isLoading = true;  // Set loading state
    currentQuery = query; // Set the current query
    displaySearchQuery(currentQuery); // Call to display the search query
    try {
      // Pass the page parameter instead of currentPage
      const result = await searchService.post(query, page);  
      if (result.success) {
        totalPages = result.data.meta.pageCount; // Update total pages based on response
        renderSearchResults(result.data.data, page > 1); // Render results
      } else {
        console.error('Search error:', result.message);
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      isLoading = false;  // Reset loading state
    }
  } else {
    console.error('No search query provided');
  }
}

// Function to render search results to the page
function renderSearchResults(results, append = false) {
  const resultContainer = document.querySelector('.search-result-container');

  if (!append) {
    resultContainer.innerHTML = ''; // Clear previous results if not appending
  }

  if (!results || results.length === 0) {
    if (!append) {
      resultContainer.innerHTML = '<p>No results found.</p>';
    }
    return;
  }
  
  const postElements = results.map(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post-item';

    const formattedDate = formatDate(post.created);
    const formattedTags = formatTags(post.tags);

    return `
      <div class="post-item">
        <div class="post-meta">
          <a class="profile-link" href="/profile/?username=${post.author.name}">
            <img class="author-avatar" src="${post.author.avatar.url}" alt="${post.author.avatar.alt}" />
          </a>
          <div class="post-info">
            <a class="profile-link" href="/profile/?username=${post.author.name}">
              <span class="mb--1"><small>${post.author.name}</small></span>
            </a>
            <span><small>${formattedDate}</small></span>
          </div>
        </div>
        <a class="post-details-link" href="/post/?id=${post.id}">
          <h2>${post.title}</h2>
        </a>
        <p class="tags-container">${formattedTags}</p>
      </div>
    `;
    }).join(''); // Join the array into a single string

    resultContainer.innerHTML += postElements; 
}

function displaySearchQuery(query) {
  const resultContainer = document.querySelector('.search-result-container');
  
  // Remove any previous search header to avoid duplicates
  const existingHeader = document.querySelector('.search-header');
  if (existingHeader) {
    existingHeader.remove();
  }

  // Create a new header for the search query
  const searchHeader = document.createElement('h2');
  searchHeader.className = 'search-header'; // Optional: Add a class for styling or identification
  searchHeader.textContent = `Search result for: ${query}`;

  // Insert the header before the result container
  resultContainer.parentNode.insertBefore(searchHeader, resultContainer);
}

// Function to load more search results on scroll
async function loadMoreSearchResults() {
  if (currentPage < totalPages && !isLoading) {
    currentPage += 1;  // Increment the page
    await performSearch(currentQuery, currentPage);  // Fetch the next page
  }
}

// Initialize search when the page loads
function initSearch() {
  const searchQuery = getQueryFromUrl();
  if (searchQuery) {
    currentQuery = searchQuery;
    performSearch(currentQuery);
    setupInfiniteScroll(loadMoreSearchResults);  // Set up infinite scroll
  }
}

document.addEventListener('DOMContentLoaded', initSearch);
