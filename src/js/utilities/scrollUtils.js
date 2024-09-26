/**
 * Loads more content using the provided load function and updates the current page.
 * @param {Function} loadFunction - The function to call to load more content.
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @returns {Promise<number>} - The new current page number.
 */
export async function loadMoreContent(loadFunction, currentPage, totalPages) {
  if (currentPage < totalPages) {
    const nextPage = currentPage + 1;
    await loadFunction(nextPage);
    return nextPage;
  }
  return currentPage;
}

/**
 * Sets up infinite scrolling for a page.
 * @param {Function} loadMoreFunction - The function to call when more content needs to be loaded.
 * @param {number} [threshold=200] - The number of pixels from the bottom of the page to trigger loading more content.
 */
export function setupInfiniteScroll(loadMoreFunction, threshold = 200) {
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - threshold) {
      loadMoreFunction();
    }
  });
}