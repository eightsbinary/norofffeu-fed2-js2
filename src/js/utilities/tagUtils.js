export function formatTags(tags) {
  if (!tags || tags.length === 0) return '';
  return tags
    .map(tag => `<a href="/tag/?tag=${encodeURIComponent(tag)}" class="tag">#${tag}</a>`) // Add '#' before each tag
    .join(' '); // Join tags with a space
}