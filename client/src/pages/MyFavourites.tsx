import FavoriteCard from "@/components/FavoriteCard";
import { getFavoritesOfUser } from "@/helper/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useDishContext } from "@/Context/DishContext";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ ShadCN Skeleton

const MyFavourites = () => {
  const dishContext = useDishContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFavorites = async () => {
      try {
        const response = await getFavoritesOfUser();
        dishContext?.setFavorites(response);
      } catch (error) {
        toast.error("Failed to load favorites.", { id: "fav" });
      } finally {
        setLoading(false); // ✅ mark loading done
      }
    };

    getFavorites();
  }, []);

  // Skeleton card component
  const SkeletonCard = () => (
    <div className="rounded-3xl bg-white p-4 shadow space-y-4 h-[400px]">
      <Skeleton className="h-40 w-full rounded-xl bg-blue-200/40" />
      <Skeleton className="h-6 w-3/4 bg-blue-200/40" />
      <Skeleton className="h-4 w-1/2 bg-blue-100/40" />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-white py-12">
      <div className="max-w-[85%] mx-auto">
        <motion.h1
          className="text-4xl font-bold text-blue-900 text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          My Favorite Dishes
        </motion.h1>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : dishContext?.favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-600 mt-24">
            <img src="/empty-favorites.svg" alt="Empty" className="w-40 mb-4" />
            <p className="text-lg">No favorites added yet.</p>
          </div>
        ) : (
          <motion.div
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.05 },
              },
            }}
          >
            {dishContext?.favorites.map((fav: any) => (
              <motion.div
                key={fav._id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <FavoriteCard
                  image={fav.image}
                  name={fav.name}
                  description={fav.description}
                  favoriteId={fav._id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyFavourites;
