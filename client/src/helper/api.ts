import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post("/login", { email, password });
    if (response.status !== 200) {
      console.log("Something went wrong while logging in.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const regiterUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const response = await axios.post("/register", {
      username,
      email,
      password,
    });
    if (response.status !== 200) {
      console.log("Something went wrong while siging in.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get("/verify");
    if (response.status !== 200) {
      console.log("Something went wrong while getting user profile.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post("/logout");
    if (response.status !== 200) {
      console.log("Something went wrong while logging out.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const addToFavorites = async (name: string,description:string,recipe:string[],image:string|null) => {
  try {
    const response = await axios.post("/add-favorite", { name,description, recipe, image });
    if (response.status !== 200) {
      console.log("Something went wrong while adding to favorites.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const removeFromFavorites = async (favoriteId: string) => {
  try {
    const response = await axios.post("/remove-favorite", { favoriteId });
    if (response.status !== 200) {
      console.log("Something went wrong while removing from favorites.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const getFavoritesOfUser = async () => {
  try {
    const response = await axios.get("/get-favorite");
    if (response.status !== 200) {
      console.log("Something went wrong while getting favorites.");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const getSuggetions = async (ingredients: string[], info: string) => {
  try {
    const reponse = await axios.post("/suggest-ingredients", {
      ingredients,
      info,
    });
    if (reponse.status !== 200) {
      console.log(
        "Something went wrong while getting suggetions by ingredients."
      );
    }
    return reponse;
  } catch (error) {
    console.log(error);
  }
};

export const getSuggetionsByName = async (dishName: string) => {
  try {
    const reponse = await axios.post("/suggest-dishname", { dishName });
    if (reponse.status !== 200) {
      console.log(
        "Something went wrong while getting suggetions ny dish name."
      );
    }
    return reponse;
  } catch (error) {
    console.log(error);
  }
};

export const fullRecipe = async (
  dishName: string,
  dishDescription: string,
  ingredients: string[]
) => {
  try {
    const response = await axios.post("/recipe", {
      dishName,
      dishDescription,
      ingredients,
    });
    if (response.status !== 200) {
      console.log("Something went wrong while generating recipe");
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
