    // routes/suggest.ts
import express from "express";
import { getFullRecipe, suggestBasedOnDishName, suggestBasedOnIngredients } from "../controllers/Suggest.controller";
import { checkImageStatus, generateImage } from "../controllers/ImageGenerate.controller";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/Auth.controller";
import { verifyToken } from "../helper/token-manager";
import { addToFavorites, getFavorites, removeFromFavorites } from "../controllers/favorite.controller";
const router = express.Router();

router.post("/suggest-ingredients",suggestBasedOnIngredients);
router.post("/suggest-dishname",suggestBasedOnDishName);
router.post("/recipe",getFullRecipe);
router.post('/generate', generateImage);
router.get('/status/:requestId', checkImageStatus);

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout',verifyToken, logoutUser)
router.get('/verify',verifyToken, getUserProfile)

router.post('/add-favorite', verifyToken,addToFavorites);
router.post('/remove-favorite', verifyToken,removeFromFavorites);
router.get('/get-favorite', verifyToken,getFavorites);

export default router;
