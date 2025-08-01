type IngredientInfo = {
  ingredient: string;
  quantity?: string;
  description?: string;
};

export const parseIngredientLine = (line: string): IngredientInfo | null => {
  const boldMatch = /\*\*(.+?)\*\*/.exec(line);
  if (!boldMatch) return null;

  const ingredient = boldMatch[1];

  // Replace the bolded ingredient with a placeholder
  const cleaned = line.replace(/\*\*(.+?)\*\*/, "<<<INGR>>>");
  const [before, after] = cleaned.split("<<<INGR>>>").map((s) => s?.trim() || "");

  let quantity: string | undefined = before || undefined;
  let description: string | undefined = after || undefined;

  // Fallback if quantity appears in description
  if (!quantity && description) {
    const descParts = description.split(/[,|\-]/).map((s) => s.trim()).filter(Boolean);
    if (descParts.length > 1) {
      quantity = descParts[0];
      description = descParts.slice(1).join(", ");
    }
  }

  // Final cleanup if ingredient somehow leaked into quantity
  if (quantity && quantity.toLowerCase().includes(ingredient.toLowerCase())) {
    quantity = undefined;
  }

  return {
    ingredient,
    quantity,
    description,
  };
};
