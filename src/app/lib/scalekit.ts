import { Scalekit } from '@scalekit-sdk/node';

let scalekitInstance: Scalekit | null = null;

function getScalekit(): Scalekit {
  const environmentUrl = process.env.SCALEKIT_ENVIRONMENT_URL;
  const clientId = process.env.SCALEKIT_CLIENT_ID;
  const clientSecret = process.env.SCALEKIT_CLIENT_SECRET;

  if (!environmentUrl || !clientId || !clientSecret) {
    throw new Error(
      'Scalekit is not configured. Set SCALEKIT_ENVIRONMENT_URL, SCALEKIT_CLIENT_ID, and SCALEKIT_CLIENT_SECRET environment variables.'
    );
  }

  if (!scalekitInstance) {
    scalekitInstance = new Scalekit(environmentUrl, clientId, clientSecret);
  }
  return scalekitInstance;
}

export { getScalekit };

