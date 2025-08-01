// openrouter.ts
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const askOpenRouter = async (userMessage: string) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "system",
            content: "You are a concise and creative cooking assistant",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // or your frontend domain
          "X-Title": "ChefGPT",
        },
      }
    );

    // Log the full response to debug
    // console.log("OpenRouter response:", response.data);

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No message content returned from OpenRouter");
    }

    return content;
  } catch (error: any) {
    console.error("OpenRouter Error:", error?.response?.data || error.message);
    throw error;
  }
};

