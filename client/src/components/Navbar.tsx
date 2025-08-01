import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/Context/AuthContext";
import { logoutUser } from "@/helper/api";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useAuth } from '@/Context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();

  const auth = useAuth();

  const handleLogout = async () => {
    try {
      toast.loading("Logging out...", { id: "logout" });
      await logoutUser();
      auth.setUser({
        username: "",
        email: "",
        profilePicture: "",
      });
      auth.setIsLoggedIn(false);
      navigate("/login");
      toast.success("Logout successful!", { id: "logout" });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-blue-300 sticky top-0 p-3 flex items-center justify-between gap-6 z-30">
      <h1 onClick={()=>navigate('/')} className="font-bold cursor-pointer justify-start text-xl text-white bg-blue-900 rounded-full px-2 py-1">Chef-GPT</h1>
      <div className="flex items-end gap-5">
        {auth.isLoggedIn ? (
          <>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="secondary" onClick={() => navigate("/favourites")}>
              Favourites
            </Button>

            <Popover>
              <PopoverTrigger>
                <img
                  src={
                    auth?.profilePicture || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-9 h-9 rounded-full cursor-pointer"
                />
              </PopoverTrigger>
              <PopoverContent  className="w-full mt-2 py-2 px-4 flex flex-col items-start gap-4">
                <p>Name : {auth.username}</p>
                <p>Email : {auth.email}</p>
                <Button variant="secondary" className="w-full bg-blue-300" onClick={handleLogout}>
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
