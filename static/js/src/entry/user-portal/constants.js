export const LOGIN_REDIRECT_KEY = 'postLoginRedirect';
export const LOGGED_IN_FLAG_KEY = 'isLoggedIn';
export const WELCOME_MESSAGE_KEY = 'umpWelcomeMessage';
export const COMING_SOON_MESSAGE_KEY = 'umpComingSoonMessage';
export const NON_STAFF_CONNECTION = 'Username-Password-Authentication';
export const PORTAL_API_URL = `https://${
  process.env.PORTAL_API_DOMAIN
}/v1/self/`;
export const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH_LOGOUT_COMPLETE_URL = `${
  window.location.origin
}/user-portal/logged-out`;
export const AUTH_LOGIN_COMPLETE_URL = `${
  window.location.origin
}/user-portal/logged-in`;
export const TITLE_SUFFIX = ' | User Management Portal | The Texas Tribune';
