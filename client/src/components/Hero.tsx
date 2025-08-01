import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Flame, Leaf } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-4xl font-bold text-blue-900 mb-4 leading-tight tracking-tight">
          Discover Top Taste 🍽️
        </h1>

        <p className="text-lg sm:text-xl text-blue-700 mb-6 max-w-2xl mx-auto">
          Got onions, tomatoes, and potatoes? We'll turn them into flavorful dishes in seconds!
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Badge className="bg-blue-200 text-blue-900 px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-1 shadow-sm">
            <Sparkles className="w-4 h-4" /> Smart Suggestions
          </Badge>
          <Badge className="bg-blue-200 text-blue-900 px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-1 shadow-sm">
            <Flame className="w-4 h-4" /> Quick Recipes
          </Badge>
          <Badge className="bg-blue-200 text-blue-900 px-4 py-2 text-sm font-medium rounded-xl flex items-center gap-1 shadow-sm">
            <Leaf className="w-4 h-4" /> Minimal Ingredients
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-4 shadow-md border border-blue-100"
          >
            <h3 className="text-blue-900 font-semibold text-lg mb-2">Ingredient-based Cooking</h3>
            <p className="text-blue-700 text-sm">
              Enter what you have and get AI-powered recipe suggestions instantly.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-4 shadow-md border border-blue-100"
          >
            <h3 className="text-blue-900 font-semibold text-lg mb-2">Zero Food Waste</h3>
            <p className="text-blue-700 text-sm">
              Don't let your ingredients go bad. Find dishes you can cook right now.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-4 shadow-md border border-blue-100"
          >
            <h3 className="text-blue-900 font-semibold text-lg mb-2">Fast & Easy</h3>
            <p className="text-blue-700 text-sm">
              Recipes made simple for beginners, busy folks, and foodies alike.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
