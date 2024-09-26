import postService from "../../api/services/postService";

export async function onDeletePost(postId) {
  console.log(postId)
  const confirmDelete = confirm('Are you sure you want to delete this post?');
  if (!confirmDelete) return;

  try {
    const result = await postService.delete(postId); // Call delete API from postService
    if (result.success) {
      alert('Post deleted successfully');
      window.location.href = '/'; // Redirect to posts list after deletion
    } else {
      console.error('Failed to delete post:', result.message);
      alert('Error deleting post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    alert('An error occurred while deleting the post.');
  }
}
