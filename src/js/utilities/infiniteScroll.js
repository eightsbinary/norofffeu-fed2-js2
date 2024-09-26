export function setupInfiniteScroll(loadFunction) {
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
      loadFunction();
    }
  });
}