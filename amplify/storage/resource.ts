import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'myProjectFiles',
  access: (allow) => ({
    // バケットルートは許可できないらしい
    'public/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});