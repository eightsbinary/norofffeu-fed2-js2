import { onCreatePost } from "../../ui/post/create";
import { authGuard } from "../../utilities/authGuard";
import { updateProfileLink } from "../../utilities/updateProfileLink";

authGuard();
updateProfileLink();

const form = document.forms.createPost;

form.addEventListener("submit", onCreatePost);
