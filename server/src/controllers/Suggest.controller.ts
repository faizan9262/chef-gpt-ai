import { Request, Response } from "express";
import { askOpenRouter } from "../helper/openrouter";

export const suggestBasedOnIngredients = async (req: Request, res: Response) => {
  try {
    const { ingredients,info } = req.body;

    const userMessage = `I have these ingredients: ${ingredients.join(
      ", "
    )}. Suggest 3 simple and creative dishes using only these items. Return me array of this 3 dishes, each dish is object which have title,description and promot to generate image, nothing other than that no extra text, only array with 3 dish object.
    Here are some additional information use this for best suggestions: ${info}.`;

    const reply = await askOpenRouter(userMessage);

    res.status(200).json(reply);
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Rate limit hit. Try again later.");
      return { error: "Rate limit exceeded. Please wait and try again." };
    }
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong while generating suggetions." });
  }
};

export const suggestBasedOnDishName = async (req: Request, res: Response) => {
  try {
    const { dishName } = req.body;

    const userMessage = `I want to create a dish called '${dishName}'. Suggest 3 simple and creative dishes based on this name. Return me array of this 3 dishes, each dish is object which have title,description and prompt to generate image, nothing other than that no extra text, only array with 3 dish object.`;

    const reply = await askOpenRouter(userMessage);

    res.status(200).json(reply);
  } catch (error) {
    if (error.response?.status === 429) {
      console.warn("Rate limit hit. Try again later.");
      return { error: "Rate limit exceeded. Please wait and try again." };
    }
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong while generating suggetions." });
  }
};

export const getFullRecipe = async (req: Request, res: Response) => {
  try {
    const { dishName, dishDescription } = req.body;
    let ingredients: string[] = [];
    if (Array.isArray(req.body.ingredients)) {
      ingredients = req.body.ingredients;
    }

    if (!dishName || !dishDescription) {
      return res.status(400).json({ error: "Name and description are required!" });
    }

    const ingredientText = ingredients.length
      ? ` I have these ingredients: ${ingredients.join(", ")}. Use only these if possible.`
      : "";

    const recipePrompt =
      `I want a full, step-by-step recipe for the dish "${dishName}". ` +
      `The description is: "${dishDescription}".` +
      `${ingredientText} Provide beginner-friendly, numbered steps. No extra text at start or end, only numbered instructions.`;

    const reply = await askOpenRouter(recipePrompt);

    return res.status(200).json(reply);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while generating recipe." });
  }
};

