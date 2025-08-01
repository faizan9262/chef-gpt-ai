import DishCard from "@/components/DishCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDish } from "@/Context/DishContext";
import { getSuggetions, getSuggetionsByName } from "@/helper/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const [text, setText] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const dishContext = useDish();
  const navigate = useNavigate();

  const loadingPhrases = [
    "✨ Gathering culinary inspiration...",
    "🎨 Painting the perfect plate...",
    "🧠 Brewing tasty thoughts...",
  ];

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const addToList = (item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    const capitalized =
      trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    if (dishContext?.ingredients.includes(capitalized)) return;
    dishContext?.setIngredients((prev) => [...prev, capitalized]);
    setText("");
  };

  const removeFromList = (item: string) => {
    dishContext?.setIngredients((prev) => prev.filter((i) => i !== item));
  };

  const handlClick = async () => {
    try {
      if (switchChecked && !text.trim()) {
        return toast.error("Please enter a dish name");
      }
      if (!switchChecked && !info.trim()) {
        return toast.error("Please describe your taste.");
      }

      dishContext?.setDishes([]);
      setIsLoading(true);

      const response = switchChecked
        ? await getSuggetionsByName(text)
        : await getSuggetions(dishContext?.ingredients, info);

      const data = response?.data;
      try {
        const cleaned = data.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned).map((item: any) => ({
          name: item.title,
          description: item.description,
          prompt: item.prompt,
        }));
        dishContext?.setDishes(parsed);
      } catch (err) {
        toast.error("Invalid response format from server");
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get suggestions");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl md:text-4xl font-bold text-blue-900 text-center max-w-xl">
        🍽️ Let's Find Your Next Favorite Dish
      </h1>

      {/* Input Toggle */}
      <div className="flex items-center gap-2">
        <Label className="text-sm text-blue-800">Switch to Dish Mode</Label>
        <Switch
          className="data-[state=checked]:bg-blue-500"
          checked={switchChecked}
          onCheckedChange={setSwitchChecked}
        />
      </div>

      {/* Input Block */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
        <Input
          placeholder={
            switchChecked ? "What dish do you want?" : "Add ingredient"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (!switchChecked && e.key === "Enter") addToList(text);
          }}
          className="w-full bg-white shadow-sm text-blue-900"
        />
        {!switchChecked && (
          <Button
            onClick={() => addToList(text)}
            className="bg-blue-600 text-white"
          >
            Add
          </Button>
        )}
      </div>

      {/* Extra Info Input */}
      {!switchChecked && (
        <Input
          placeholder="Describe your taste preference..."
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          className="w-full max-w-2xl bg-white shadow-sm text-blue-900"
        />
      )}

      {/* Ingredients Display */}
      {!switchChecked && dishContext?.ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 max-w-3xl justify-center">
          {dishContext.ingredients.map((i, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm cursor-pointer hover:bg-red-300"
              onClick={() => removeFromList(i)}
            >
              {i} ✕
            </span>
          ))}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handlClick}
        className="bg-blue-800 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700"
        disabled={isLoading}
      >
        {switchChecked ? "Cook Now" : "What Can I Cook?"}
      </Button>

      {/* Card Section Header */}
      {(isLoading || dishContext?.dishes.length > 0) && (
        <h2 className="text-xl font-semibold text-blue-900 text-center">
          {isLoading ? loadingPhrases[phraseIndex] : "🍲 Your Dish Suggestions"}
        </h2>
      )}

      {/* Skeleton Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full max-w-6xl">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="h-full w-full flex flex-col justify-between shadow-xl bg-blue-50 border-2 border-blue-300 rounded-2xl animate-pulse">
              <CardContent className="px-6 py-2 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-1/2 rounded-md bg-blue-200" />
                  <Skeleton className="h-5 w-20 rounded-md bg-blue-200" />
                </div>
                <div className="space-y-2 mt-1">
                  <Skeleton className="h-3 w-full rounded bg-blue-100" />
                  <Skeleton className="h-3 w-5/6 rounded bg-blue-100" />
                  <Skeleton className="h-3 w-2/3 rounded bg-blue-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dishes Display */}
      {!isLoading && dishContext?.dishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full max-w-6xl">
          {dishContext.dishes.map((dish, index) => (
            <DishCard
              key={index}
              name={dish.name}
              description={dish.description}
              onClick={() =>
                navigate(`/${dish.name}`, {
                  state: dish,
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
