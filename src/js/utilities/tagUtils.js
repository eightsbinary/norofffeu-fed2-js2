export function formatTags(tagsArray) {
  if (!tagsArray || tagsArray.length === 0) return ''; 
  return tagsArray.map(tag => `<span class="tag">#${tag}</span>`).join(' '); 
}