import axios from "axios";

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await axios.post('/generate', {
      prompt,
    });

    return response.data.requestId || null;
  } catch (error: any) {
    console.error('Error generating image request:', error.message);
    return null;
  }
};

export const pollImageStatus = async (
  requestId: string,
  intervalMs: number = 5000,
  timeoutMs: number = 60000
): Promise<string[] | null> => {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const res = await axios.get(`/status/${requestId}`);

        if (res.data.done && res.data.images) {
          return resolve(res.data.images);
        }

        if (Date.now() - startTime >= timeoutMs) {
          return reject(new Error('Timeout while waiting for image generation.'));
        }

        setTimeout(poll, intervalMs);
      } catch (error: any) {
        reject(new Error(`Error checking image status: ${error.message}`));
      }
    };

    poll();
  });
};
