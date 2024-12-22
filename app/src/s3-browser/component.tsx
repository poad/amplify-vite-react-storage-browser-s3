import { createStorageBrowser, createAmplifyAuthAdapter } from '@aws-amplify/ui-react-storage/browser';
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

function S3Browser({ bucket }: { bucket: string }) {
  const { StorageBrowser } = createStorageBrowser({
    config: {
      ...createAmplifyAuthAdapter(),
      listLocations: async ({ options }) => {
        return {
          items: [
            {
              id: 'root',
              bucket,
              permissions: ['delete', 'get', 'list', 'write'],
              prefix: '',
              type: 'BUCKET',
            },
          ],
          nextToken: options?.nextToken,
        };
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
