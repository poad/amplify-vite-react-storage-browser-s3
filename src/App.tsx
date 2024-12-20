import {
  createStorageBrowser,
} from '@aws-amplify/ui-react-storage/browser';
import '@aws-amplify/ui-react-storage/styles.css';
import {
  FcAlphabeticalSortingAz,
  FcAlphabeticalSortingZa,
  FcMinus,
  FcNext,
  FcPrevious,
  FcRefresh,
  FcSearch,
} from 'react-icons/fc';
import { IconsProvider } from '@aws-amplify/ui-react';

import config from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';
import useAuth from './auth/hooks';
import { signInWithRedirect } from 'aws-amplify/auth';
import { list } from 'aws-amplify/storage';

Amplify.configure(config);

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <></>;
  }
  if (!auth.isAuthenticated) {
    (async () => {
      try {
        await signInWithRedirect({ provider: { custom: 'AzureAD' } });
      } catch (error) {
        console.trace(error);
      }
    })();
  }

  (async () => {
    const { items } = await list({ path: '' });
    items.forEach((object) => console.log(JSON.stringify(object)));
  })();

  if (!auth.credentials) {
    return <></>;
  }

  const { StorageBrowser } = createStorageBrowser({
    config: {
      region: config.storage.aws_region,
      listLocations: async () => {
        const { items, nextToken } = await list({ path: '' });
        return {
          items: items.filter(((item) => (item.path.match(/\//g)?.length ?? 0) === 1)).map((item) => {
            return {
              id: item.path,
              bucket: config.storage.bucket_name,
              permissions: ['delete', 'get', 'list', 'write'],
              prefix: item.path,
              type: 'PREFIX',
            };
          }),
          nextToken: nextToken,
        };
      },
      getLocationCredentials: async () => ({
        credentials: {
          accessKeyId: auth.credentials?.credentials.accessKeyId ?? '',
          secretAccessKey: auth.credentials?.credentials.secretAccessKey ?? '',
          sessionToken: auth.credentials?.credentials.sessionToken ?? '',
          expiration: auth.credentials?.credentials.expiration ?? new Date(),
        },
      }),
      registerAuthListener: () => {
        // no-op
      },
    },
  });

  return (
    <main>
      {auth.token ?
        (<>
          <div style={{ width: '20rem', marginTop: '3rem' }}>
            <button onClick={auth.signOut}>Sign Out</button>
          </div>

          <h1>Storage Browser for AWS S3</h1>

          <IconsProvider
            icons={{
              storageBrowser: {
                refresh: <FcRefresh />,
                'sort-indeterminate': <FcMinus />,
                'sort-ascending': <FcAlphabeticalSortingAz />,
                'sort-descending': <FcAlphabeticalSortingZa />,
              },
              searchField: {
                search: <FcSearch />,
              },
              pagination: {
                next: <FcNext />,
                previous: <FcPrevious />,
              },
            }}
          >
            <StorageBrowser />
          </IconsProvider>
          <div style={{ color: '#2d2d2d', whiteSpace: 'pre-wrap' }}>
            {auth.attributes?.name}
          </div>
          <div style={{ color: '#2d2d2d', whiteSpace: 'pre-wrap' }}>
            {auth.attributes?.email}
          </div></>) : (<></>)}
    </main>
  );
}

export default App;
