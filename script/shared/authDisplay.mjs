//authDisplay.mjs
import { getAccessToken } from "./accessToken.mjs";

export function isUserSignedIn() {
    const accessToken = getAccessToken();
    return accessToken !== null; 
}



