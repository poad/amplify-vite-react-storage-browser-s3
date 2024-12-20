import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'us-west-2_BCtwQ6zNZ',
  identityPoolId: 'us-west-2:a5aa4683-9246-4969-a377-a3f1366b42c5',
  authRoleArn: 'arn:aws:iam::786553742110:role/dev-saml-next-js-auth-role',
  unauthRoleArn: 'arn:aws:iam::786553742110:role/dev-saml-next-js-unauth-role',
  userPoolClientId: '3k2dko4qrpn98ehl565v10m516',
});
