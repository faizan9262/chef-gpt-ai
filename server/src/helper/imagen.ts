import * as aiplatform from '@google-cloud/aiplatform';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set credentials path
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../vertex-key.json');

// Client setup
const { PredictionServiceClient } = aiplatform.v1;
const client = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
});

const endpoint = 'projects/chefgpt-466816/locations/us-central1/publishers/google/models/imagegeneration';

export async function generateImage(prompt: string): Promise<string | null> {
  const instance = {
    structValue: {
      fields: {
        prompt: {
          stringValue: prompt,
        },
      },
    },
  };

  const parameters = {
    structValue: {
      fields: {
        guidance_scale: { numberValue: 7.5 },
        sampleCount: { numberValue: 1 },
      },
    },
  };

  const request = {
    endpoint,
    instances: [instance],
    parameters,
  };

  try {
    const [response] = await client.predict(request);
    const prediction = response.predictions?.[0] as any;
    const imageBase64 = prediction?.structValue?.fields?.bytesBase64Encoded?.stringValue;

    return typeof imageBase64 === 'string' ? imageBase64 : null;
  } catch (err) {
    console.error('Error generating image:', err);
    return null;
  }
}
