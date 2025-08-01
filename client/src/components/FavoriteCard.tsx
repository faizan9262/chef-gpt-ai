import { useDishContext } from "@/Context/DishContext";
import { removeFromFavorites } from "@/helper/api";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface FavoriteCardProps {
  image: string;
  name: string;
  description: string;
  favoriteId: string;
}

const FavoriteCard = ({
  image,
  name,
  description,
  favoriteId,
}: FavoriteCardProps) => {

  const navigate = useNavigate();
  const dishContext = useDishContext();


  const removeFavorite = async () => {
    try {
      toast.loading("Removing favorite...", { id: "remove-fav" });
      const response = await removeFromFavorites(favoriteId);
      dishContext.setFavorites((prev) =>
        prev.filter((fav) => fav._id !== favoriteId)
      );
      toast.success("Favorite removed successfully!", { id: "remove-fav" });
    } catch (error) {
      toast.error("Failed to remove favorite.", { id: "remove-fav" });
    }
  };


  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent click from bubbling up
    navigate(`/favorite-dish/${name}`,{state:{
      name,
      description,
      image,
      recipe: dishContext?.favorites.find(fav => fav._id === favoriteId)?.recipe || [],
      id: favoriteId
    }});
  }

  return (
    <motion.div
      onClick={handleClick} // Prevent click from bubbling up
      whileHover={{ scale: 1.015 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-lg h-[400px] rounded-3xl overflow-hidden shadow-xl group"
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      <div className="absolute bottom-0 z-20 p-6 text-white">
        <h3 className="text-2xl font-extrabold tracking-tight">{name}</h3>
        <p className="mt-1 text-sm text-white/80 line-clamp-3">{description}</p>
      </div>

      {/* Alert Dialog for Remove Confirmation */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div
            className="absolute cursor-pointer top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md transition transform group-hover:scale-110"
            title="Remove from favorites"
          >
            <Heart className="h-5 w-5 text-blue-600 fill-blue-400" />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              This dish will be permanently removed from your favorites.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={removeFavorite}>
              Yes, remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default FavoriteCard;
