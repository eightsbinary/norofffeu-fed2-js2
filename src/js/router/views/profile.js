import { authGuard } from "../../utilities/authGuard";
import { updateProfileLink } from "../../utilities/updateProfileLink";

authGuard();
updateProfileLink();
