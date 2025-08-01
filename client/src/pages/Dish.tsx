import { useDish } from "@/Context/DishContext";
import { addToFavorites, fullRecipe } from "@/helper/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BadgeCheck, HeartPlus, MountainSnowIcon } from "lucide-react";
import { generateImage, pollImageStatus } from "@/helper/imageGenerate";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Dish = () => {
  const dishContext = useDish();
  const { name, description, prompt } = useLocation().state;
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<string>("");
  const [imageLoading, setImageLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const getFullRecipe = async () => {
      try {
        const ingredients = dishContext?.ingredients ?? [];
        const res = await fullRecipe(name, description, ingredients);
        setRecipe(res);
      } catch (error) {
        toast.error("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };
    getFullRecipe();
  }, [dishContext?.ingredients]);

  useEffect(() => {
    const generate = async () => {
      try {
        setImageLoading(true);
        const requestId = await generateImage(prompt);
        if (!requestId) return setImageLoading(false);

        const imageArray = await pollImageStatus(requestId);
        setImage(imageArray?.[0] ?? null);
        setImageLoading(false);
      } catch (error: any) {
        console.log("Image generation error:", error);
        toast.error(error.error, { id: "image-generate" });
      }
    };
    generate();
  }, [prompt]);

  const extractSteps = (text: string): string[] => {
    const lines = text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const steps: string[] = [];
    let currentStep = "";

    lines.forEach((line) => {
      if (/^\d+[\.\)]\s*/.test(line)) {
        // New step title (keep formatting like **bold** intact)
        if (currentStep) steps.push(currentStep.trim());
        currentStep = line;
      } else {
        // Add sub-lines (ingredients, actions, etc.)
        currentStep += `\n${line}`;
      }
    });

    if (currentStep) steps.push(currentStep.trim());

    return steps.length > 0 ? steps : ["No clear steps found in the recipe."];
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g); // split by **...**
    return parts.map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-bold text-blue-800">
          {part}
        </strong>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const steps = recipe ? extractSteps(recipe) : [];

  console.log("Recipe Steps:", steps);
  console.log("Dish Name:", name);
  console.log("Dish Description:", description);
  console.log("Image Prompt:", image);

  const handleAddToFavorites = async () => {
    try {
      if (!name || !description || steps.length === 0 || !image) {
        toast.error("Cant add to favorites,wait for recipe and image to load");
        return;
      }
      toast.loading("Adding to favorites...", { id: "add-favorite" });
      const response = await addToFavorites(name, description, steps, image);
      if (response) {
        toast.success("Added to favorites", { id: "add-favorite" });
      } else {
        toast.error("Failed to add to favorites", { id: "add-favorite-error" });
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Something went wrong while adding to favorites");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid lg:grid-cols-2 gap-10"
      >
        {/* Image + Ingredients */}
        <div className="relative flex flex-col items-center justify-center">
          {imageLoading ? (
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-blue-100 overflow-hidden">
              {/* The pulsing blue-toned skeleton */}
              <Skeleton className="h-full w-full rounded-2xl bg-blue-200/60" />

              {/* Overlay gradient to give visual image depth */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 opacity-40" />

              {/* Central image-like icon */}
              <MountainSnowIcon
                className="absolute h-12 w-12 text-blue-400 opacity-70"
                strokeWidth={1.5}
              />

              {/* Optional bottom placeholder lines (like image caption) */}
              <div className="absolute bottom-4 left-4 space-y-2">
                <Skeleton className="w-32 h-3 rounded bg-blue-300/60" />
                <Skeleton className="w-20 h-3 rounded bg-blue-300/40" />
              </div>
            </div>
          ) : image ? (
            <img
              src={image}
              alt="Dish"
              className="rounded-2xl shadow-lg w-full aspect-square max-w-md object-cover"
            />
          ) : (
            <div className="text-sm text-red-500">Image generation failed</div>
          )}
        </div>

        {/* Dish Info */}
        <div className="flex flex-col justify-center space-y-6">
          <motion.h1
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-blue-900"
          >
            {name}
          </motion.h1>
          <p className="text-blue-400 text-lg ">{description}</p>

          <div className="flex items-center text-green-600">
            <BadgeCheck className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Generated with AI</span>
          </div>
          <div className="w-full flex flex-wrap gap-1">
            {(dishContext?.ingredients ?? []).map((item, index) => (
              <span
                key={index}
                className="bg-blue-300/70 text-blue-900 border-2 border-blue-400 text-xs font-medium px-3 py-1 rounded-full shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
          <Button
            onClick={handleAddToFavorites}
            disabled={!image || steps.length === 0}
            className="bg-blue-950 flex gap-1 items-center justify-center w-1/2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Favourites <HeartPlus />
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-muted/30 border-muted shadow-md">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-blue-900">
              Preparation Steps
            </h2>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-full rounded bg-blue-300/70" />
                    <Skeleton className="h-4 w-3/4 rounded bg-blue-200/70" />
                  </div>
                ))}
              </div>
            ) : steps.length > 0 ? (
              <div className="space-y-5">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="bg-white border-l-[6px] border-blue-900 shadow-sm p-4 rounded-md"
                  >
                    <div className="flex gap-3 items-start">
                      <div className="text-sm font-bold text-blue-800 shrink-0">
                        {i + 1}.
                      </div>
                      <p className="text-sm text-blue-900 font-semibold leading-relaxed whitespace-pre-line">
                        {renderBoldText(step.replace(/^\d+[\.\)]\s*/, ""))}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-red-500">No recipe steps available.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dish;
