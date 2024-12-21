import useAuth from '../auth/hooks';
import config from '../../amplify_outputs.json';
import { list } from 'aws-amplify/storage';
import { createStorageBrowser } from '@aws-amplify/ui-react-storage/browser';
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

function S3Browser({ rootPath = '' }: {rootPath?: string}) {
  const auth = useAuth();
  const { StorageBrowser } = createStorageBrowser({
    config: {
      region: config.storage.aws_region,
      listLocations: async () => {
        const { items, nextToken } = await list({ path: rootPath });
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
  );
}

export default S3Browser;
