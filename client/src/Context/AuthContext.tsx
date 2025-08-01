import { getUserProfile } from "@/helper/api";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  username: string;
  email: string;
  profilePicture: string;
  setUser: (user: Partial<UserData>) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

type UserData = {
  username: string;
  email: string;
  profilePicture: string;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserData>({
    username: "",
    email: "",
    profilePicture:"",
  });
  const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false);

  const setUser = (newUser: Partial<UserData>) => {
    setUserState((prev) => ({
      ...prev,
      ...newUser,
    }));
  };
  
  useEffect(()=>{
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response) {
          setUser({
            username: response.username,
            email: response.email,
            profilePicture: response.profilePicture || "",
          });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  },[])

  const value: AuthContextType = {
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    setUser,
    isLoggedIn,
    setIsLoggedIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
