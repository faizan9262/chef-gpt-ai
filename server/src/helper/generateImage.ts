import { Request, Response } from "express";
import { Client } from "@gradio/client";

export const generateDishImage = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Connect to your Gradio live URL
    const client = await Client.connect("https://449fa0f7a8285534e7.gradio.live/");

    // Call the `/generate` endpoint with the prompt
    const result = await client.predict("/generate", { prompt });

    const image = (result.data as string[])?.[0];

    if (!image) {
      return res.status(500).json({ error: "No image returned" });
    }

    return res.status(200).json({ image });

  } catch (error) {
    console.error("Gradio Error:", error);
    return res.status(500).json({ error: "Failed to generate image from Gradio" });
  }
};
