import React, { useEffect } from 'react';
import {
  fetchAuthSession,
  CredentialsAndIdentityId,
  AuthUser,
  getCurrentUser,
  FetchUserAttributesOutput,
  fetchUserAttributes,
} from 'aws-amplify/auth';
import { AuthEventData } from '@aws-amplify/ui';
import { useAuthenticator } from '@aws-amplify/ui-react';

const useAuth = (): {
  user?: AuthUser;
  token?: string;
  credentials?: CredentialsAndIdentityId;
  attributes?: FetchUserAttributesOutput;
  signOut: (data?: AuthEventData | undefined) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
} => {
  const [user, setUser] = React.useState<AuthUser | undefined>();
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const [credentials, setCredentials] = React.useState<CredentialsAndIdentityId | undefined>();
  const [attributes, setAttributes] = React.useState<
    FetchUserAttributesOutput | undefined
  >();
  const {
    authStatus,
    signOut,
  } = useAuthenticator((context) => [
    context.signOut,
    context.authStatus,
  ]);

  const handleAuth = async () => {
    try {
      const { tokens, credentials, identityId } = (await fetchAuthSession()) ?? {};
      if (tokens) {
        const { idToken } = tokens;
        if (idToken) {
          setToken(idToken.toString());
        }
      }
      if (credentials) {
        setCredentials({credentials, identityId} as CredentialsAndIdentityId);
      }

      await getCurrentUser().then((currentUser) => {
        setUser(currentUser);
        return;
      });

      await fetchUserAttributes().then((attr) => {
        setAttributes(attr);
        return;
      });
    } catch {
      setToken(undefined);
      setUser(undefined);
      setAttributes(undefined);
      setCredentials(undefined);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return {
    user,
    token,
    credentials,
    attributes,
    signOut,
    isAuthenticated: authStatus === 'authenticated',
    isLoading: authStatus === 'configuring',
  };
};

export default useAuth;
