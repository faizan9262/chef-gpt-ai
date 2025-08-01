// controllers/generateImageController.ts
import { Request, Response } from 'express';
import axios from 'axios';

export const generateImage = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Dish name is required' });
    }

    const response = await axios.post(
      'https://stablehorde.net/api/v2/generate/async',
      {
        prompt,
        params: {
          sampler_name: "k_euler_a",
          cfg_scale: 7,
          height: 512,
          width: 512,
          steps: 30
        },
        nsfw: false,
        censor_nsfw: true,
        models: ["stable_diffusion"]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.STABLE_HORDE_API_KEY || ''
        }
      }
    );

    const requestId = response.data.id;
    res.status(200).json({ requestId });
  } catch (error: any) {
    console.error('Error generating image:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
};


export const checkImageStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required' });
    }

    const pollStatus = async (retries = 0): Promise<any> => {
      const statusResponse = await axios.get(
        `https://stablehorde.net/api/v2/generate/status/${requestId}`
      );

      const data = statusResponse.data;

      if (data.done) {
        const imageUrls = data.generations.map((gen: any) => gen.img);
        return { done: true, images: imageUrls };
      }

      if (retries >= 20) {
        return { done: false, timeout: true };
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
      return pollStatus(retries + 1);
    };

    const result = await pollStatus();

    if (result.done) {
      return res.status(200).json(result);
    } else {
      return res.status(202).json({ done: false, message: "Timed out. Please try again later." });
    }

  } catch (error: any) {
    if (error.response.status === 429) {
      return res.status(429).json({ error:"Can't Generate Image at the moment. Please try again later." }); 
    }
    console.error('Error checking image status:', error.message);
    res.status(500).json({ error: 'Failed to check image status' });
  }
};

