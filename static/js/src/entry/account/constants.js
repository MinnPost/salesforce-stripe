export const LOGIN_REDIRECT_KEY = 'postLoginRedirect';
export const LOGOUT_REDIRECT_KEY = 'postLogoutRedirect';
export const LOGGED_IN_FLAG_KEY = 'isLoggedIn';
export const READ_ONLY_WELCOME_MESSAGE_KEY = 'readOnlyWelcomeMessage';
export const NON_STAFF_CONNECTION = 'Username-Password-Authentication';
export const PORTAL_API_URL = `https://${process.env.PORTAL_API_DOMAIN}/v1/`;
export const AUTH_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH_LOGOUT_COMPLETE_URL = `${
  window.location.origin
}/account/logged-out`;
export const AUTH_LOGIN_COMPLETE_URL = `${
  window.location.origin
}/account/logged-in`;
export const TITLE_SUFFIX = ' | Manage Your Account | The Texas Tribune';
export const CARD_PAYMENT_FLAG = 'credit card';
export const BLAST_PAYMENT_FLAG = 'the blast';
export const { SENTRY_DSN } = process.env;
export const { SENTRY_ENVIRONMENT } = process.env;
export const ENABLE_SENTRY = process.env.ENABLE_SENTRY.toLowerCase() === 'true';
export const GA_USER_PORTAL_NAV = {
  category: 'user portal navigation',
  actions: {
    side: 'side nav click',
    top: 'top nav click',
    footer: 'footer link click',
    inline: 'inline link click',
  },
  labels: {
    home: 'account overview',
    membership: 'membership overview',
    payments: 'donation history',
    blast: 'the blast overview',
    'blast-payments': 'the blast payment history',
    // external starting here
    'community-guidelines': 'community guidelines',
    'support-landing': 'support landing',
    'privacy-policy': 'privacy policy',
    'texas-tribune-home': 'texas tribune home',
  },
};
export const GA_USER_PORTAL = {
  category: 'user portal',
  actions: {
    'reset-password': 'reset your password',
    'contact-us': 'contact us',
    'tax-receipt': 'download your tax receipt',
    'blast-receipt': 'download your blast receipt',
    'clear-notification': 'clear notification',
  },
  labels: {
    home: 'account overview',
    membership: 'membership overview',
    payments: 'donation history',
    blast: 'the blast overview',
    'blast-payments': 'the blast payment history',
  },
};

export const GA_DONATIONS = {
  category: 'donations',
  actions: {
    'membership-intent': 'membership-intent',
  },
  labels: {
    'upgrade-membership': 'user portal - sustaining',
    'renew-membership': 'user portal - renew',
    'upgrade-contact': 'user portal - upgrade contact',
  },
};

export const GA_BLAST_INTENT = {
  category: 'blast intent',
  action: {
    'renew-blast': 'user portal - renew link',
  },
  labels: {
    'user-portal': 'user portal',
  },
};
