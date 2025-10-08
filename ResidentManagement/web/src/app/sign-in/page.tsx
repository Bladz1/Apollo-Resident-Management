import { AuthTester, AuthTesterCopy } from '@/components/auth/AuthTester';

const SIGN_IN_COPY: AuthTesterCopy = {
  endpointPath: '/auth/login',
  card: {
    title: 'Sign in to the platform',
    description:
      'This view mirrors the GitHub sign-in experience while staying on brand with the landing page gradient. Use it to send credentials to the authentication API and immediately review the response.',
    usernameLabel: 'Username',
    usernamePlaceholder: 'e.g. admin',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    rememberMeLabel: 'Remember me',
    forgotPasswordLabel: 'Forgot password?',
    forgotPasswordHref: '#',
    submitIdleLabel: 'Sign in',
    submitLoadingLabel: 'Checking…',
    footerText: 'Need an account?',
    footerLinkLabel: 'Contact the administrator for access',
    footerLinkHref: '#',
  },
  messages: {
    idle: 'Provide your credentials and press sign in to exercise the endpoint.',
    success: 'Signed in successfully! The API responded without errors.',
    errorTemplate: 'Sign in failed (HTTP {status}). Please verify the API behaviour.',
    network: 'Unable to reach the API. Confirm the server is running and the base URL is correct.',
  },
  aside: {
    badgeLabel: 'API Monitor',
    heading: 'Inspect responses in real time',
    endpointDescription: {
      before: 'This page issues a request to ',
      after: '. Ensure your backend allows CORS for the app origin.',
    },
    statusTitle: 'Status message',
    responseTitle: 'API response payload',
    defaultResponseText: 'No response yet.',
    tipsTitle: 'Quick testing tips',
    tips: [
      'Update NEXT_PUBLIC_API_BASE_URL in .env.local if the backend runs elsewhere.',
      'Watch the “API response payload” area to review returned JSON or errors.',
      'Open your browser DevTools network tab for deeper inspection of the request.',
    ],
  },
};

export default function SignInPage() {
  return <AuthTester copy={SIGN_IN_COPY} />;
}
