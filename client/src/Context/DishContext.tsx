import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// 1. Define the context type
interface Dish {
  name: string;
  description: string;
  prompt: string;
}

interface Favorite {
  name: string;
  description: string;
  image: string;
  recipe: string[];
  _id?: string; 
}

interface DishContextType {
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
}

// 2. Create context with undefined initially (not empty array!)
const DishContext = createContext<DishContextType | undefined>(undefined);

// 3. Provider component
export const DishContextProvider = ({ children }: { children: ReactNode }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  const value: DishContextType = {
    dishes,
    setDishes,
    ingredients,
    setIngredients,
    favorites,
    setFavorites
  };

  return <DishContext.Provider value={value}>{children}</DishContext.Provider>;
};

// 4. Custom hook with error handling (recommended)
export const useDishContext = () => {
  const context = useContext(DishContext);
  if (!context) {
    throw new Error("useDishContext must be used within a DishContextProvider");
  }
  return context;
};

// 5. Optional shorthand hook (without error guard)
export const useDish = (): DishContextType => {
  const context = useContext(DishContext);
  if (!context) {
    throw new Error("useDish must be used within a DishContextProvider");
  }
  return context;
};
