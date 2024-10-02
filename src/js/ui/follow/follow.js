import { checkFollowingAndInitialize } from '../../router/views/follow';

// Fetch the username and whether the user is following or not
export function initializeFollowButton(username) {
  // Check following status and initialize the follow button
  checkFollowingAndInitialize(username);
}
