// Function to handle the search action
export function handleSearchInput(event) {
  if (event.key === 'Enter') {
    const query = event.target.value.trim();
    if (query) {
      redirectToSearch(query);
    }
  }
}

// Function to redirect to the search results page
function redirectToSearch(query) {
  const searchUrl = `/search/post/?q=${encodeURIComponent(query)}`;
  window.location.href = searchUrl; // Redirect to the search results page
}
