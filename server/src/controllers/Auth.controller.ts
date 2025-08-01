import { Request, Response } from "express";
import { User } from "../model/user.model";
import bcrypt from "bcrypt";
import { createToken } from "../helper/token-manager";
import type { CookieOptions } from "express";

const USER_COOKIE_NAME = "auth-cookie";


const COOKIE_OPTIONS:CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = createToken(newUser._id.toString(), email, 7 * 24 * 60 * 60);

    res.clearCookie(USER_COOKIE_NAME, COOKIE_OPTIONS);
    res.cookie(USER_COOKIE_NAME, token, COOKIE_OPTIONS);

    const populatedUser = await User.findById(newUser._id).select("-password");
    res.status(201).json(populatedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    const isMatched = existingUser && await bcrypt.compare(password, existingUser.password);

    if (!existingUser || !isMatched) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(existingUser._id.toString(), email, 7 * 24 * 60 * 60);

    res.clearCookie(USER_COOKIE_NAME, COOKIE_OPTIONS);
    res.cookie(USER_COOKIE_NAME, token, COOKIE_OPTIONS);

    const populatedUser = await User.findById(existingUser._id).select("-password");
    res.status(200).json(populatedUser);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie(USER_COOKIE_NAME, COOKIE_OPTIONS);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.jwtData.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
