
// accessToken.mjs

export function storeAccessToken(accessToken) {
    localStorage.setItem('accessToken', accessToken);
}
export function getAccessToken() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken;
}