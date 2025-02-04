import '@aws-amplify/ui-react-storage/styles.css';

import config from './app-config';
import useAuth from './auth/hooks';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useState } from 'react';
import S3Browser from './s3-browser/component';

function App() {
  const auth = useAuth();
  const [error, setError] = useState<string | undefined>();

  if (auth.isLoading) {
    return <></>;
  }

  if (!auth.isAuthenticated) {
    (async () => {
      try {
        await signInWithRedirect({ provider: { custom: 'AzureAD' } });
      } catch (e) {
        setError(JSON.stringify(e, null, 2));
      }
    })();
  }

  if (!auth.credentials || !auth.isAuthenticated || !auth.token) {
    return <></>;
  }

  return (
    <main>
      {auth.isAuthenticated}
      {error ? (
        <pre style={{ color: 'red' }}>{error}</pre>
      ) : (
        <></>
      )}
      {auth.isAuthenticated && auth.token && !error ?
        (<>
          <div style={{ width: '20rem', marginTop: '3rem' }}>
            <button onClick={auth.signOut}>Sign Out</button>
          </div>

          <h1>Storage Browser for AWS S3</h1>

          <S3Browser bucket={config.Storage?.S3.bucket ?? ''} />
        </>) : (<></>)}
    </main>
  );
}

export default App;
