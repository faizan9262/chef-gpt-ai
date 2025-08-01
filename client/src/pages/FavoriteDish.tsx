import { useDish } from "@/Context/DishContext";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BadgeCheck, HeartMinus, MountainSnowIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { removeFromFavorites } from "@/helper/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const FavoriteDish = () => {
  const dishContext = useDish();
  const location = useLocation();
  const { name, description, image, recipe, id } = location.state;

  const [loading, setLoading] = useState(true);
  const [favRecipe, setFavRecipe] = useState<string[]>([]);
  const [favImage, setFavImage] = useState<string>("");
  const favoriteId = id || "";
  const [imageLoading, setImageLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (recipe && image) {
      setFavRecipe(recipe);
      setFavImage(image);
      setLoading(false);
    }
  }, [recipe, image]);

  console.log("Received recipe:", favRecipe);

  const extractSteps = (text: string): string[] => {
    const lines = text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const steps: string[] = [];
    let currentStep = "";

    lines.forEach((line) => {
      if (/^\d+[\.\)]\s*/.test(line)) {
        if (currentStep) steps.push(currentStep.trim());
        currentStep = line;
      } else {
        currentStep += `\n${line}`;
      }
    });

    if (currentStep) steps.push(currentStep.trim());
    return steps.length > 0 ? steps : ["No clear steps found in the recipe."];
  };

  const removeFavorite = async () => {
    try {
      toast.loading("Removing favorite...", { id: "remove-fav" });
      const response = await removeFromFavorites(favoriteId);
      dishContext.setFavorites((prev) =>
        prev.filter((fav) => fav._id !== favoriteId)
      );
      navigate("/favourites")
      toast.success("Favorite removed successfully!", { id: "remove-fav" });
    } catch (error) {
      toast.error("Failed to remove favorite.", { id: "remove-fav" });
    }
  };

  const renderBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
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

  const steps = favRecipe ?? [];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid lg:grid-cols-2 gap-10"
      >
        {/* Image Section */}
        <div className="relative flex flex-col items-center justify-center">
          {imageLoading && !favImage ? (
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center rounded-2xl bg-blue-100 overflow-hidden">
              <Skeleton className="h-full w-full rounded-2xl bg-blue-200/60" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 opacity-40" />
              <MountainSnowIcon
                className="absolute h-12 w-12 text-blue-400 opacity-70"
                strokeWidth={1.5}
              />
              <div className="absolute bottom-4 left-4 space-y-2">
                <Skeleton className="w-32 h-3 rounded bg-blue-300/60" />
                <Skeleton className="w-20 h-3 rounded bg-blue-300/40" />
              </div>
            </div>
          ) : favImage ? (
            <img
              src={favImage}
              alt="Dish"
              className="rounded-2xl shadow-lg w-full aspect-square max-w-md object-cover"
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <p className="text-sm text-red-500">Image not available.</p>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-6">
          <motion.h1
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-blue-900"
          >
            {name}
          </motion.h1>
          <p className="text-blue-400 text-lg">{description}</p>
          <div className="flex items-center text-green-600">
            <BadgeCheck className="mr-2 h-5 w-5" />
            <span className="text-sm font-medium">Generated with AI</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={!image || steps.length === 0}
                className="bg-red-500 flex gap-1 items-center justify-center w-1/2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove From Favourites <HeartMinus />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Remove this dish from favorites?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Are you sure you want to remove{" "}
                  <strong>{name}</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={removeFavorite}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Yes, Remove
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>

      {/* Steps Section */}
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

export default FavoriteDish;
