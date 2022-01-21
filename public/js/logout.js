// log user out by setting the expiration date for the auth token to a time in the past
const logout = () => {
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}