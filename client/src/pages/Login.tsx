import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Sparkles, Bot, ChefHat } from "lucide-react";
import { loginUser, regiterUser } from "@/helper/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();

  // 🌟 States for user inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      toast.loading("Logging in...", { id: "login" });
      if (!email || !password) {
        console.log("Email and password are required.");
        return;
      }
      const response = await loginUser(email, password);

      //   console.log("Login response:", response);

      auth.setUser(response);
      auth.setIsLoggedIn(true);

      toast.success("Login successful!", { id: "login" });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.", { id: "login" });
    }
  };

  const handleRegister = async () => {
    try {
      toast.loading("Registering...", { id: "register" });
      if (!username || !email || !password || !confirmPassword) {
        toast.error("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      const response = await regiterUser(username, email, password);
      //   console.log("Registration response:", response);

      auth.setUser(response);
      auth.setIsLoggedIn(true);
      toast.success("Registration successful!", { id: "register" });
      navigate("/");
      //   setIsLogin(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.", { id: "register" });
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white/70 border border-blue-300 rounded-3xl shadow-2xl text-gray-800 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Branding */}
        <div className="hidden md:flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-200 to-blue-100 border-r border-blue-300">
          <div className="flex items-center gap-2 text-blue-700">
            <ChefHat className="w-10 h-10 text-blue-500" />
            <h2 className="text-3xl font-extrabold tracking-wide">ChefGPT</h2>
          </div>
          <p className="mt-4 text-sm text-blue-700 text-center max-w-xs leading-relaxed">
            Your AI culinary partner. Craft intelligent recipes, talk to your
            digital chef, and explore smart cooking.
          </p>
          <Sparkles className="mt-6 w-10 h-10 text-blue-400 animate-pulse" />
        </div>

        {/* Right Form */}
        <div className="p-8 md:p-10">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl text-blue-800 font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-500" />
              {isLogin ? "Connect to AI-Chef" : "Initiate Chef Identity"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5 p-0">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="username">Name</Label>
                <Input
                  id="username"
                  placeholder="e.g. spiceMaster47"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-blue-50 border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-800 placeholder:text-blue-400 rounded-lg"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@aichef.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-blue-50 border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-800 placeholder:text-blue-400 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-blue-50 border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-800 placeholder:text-blue-400 rounded-lg pr-10"
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-blue-50 border border-blue-300 focus:ring-2 focus:ring-blue-400 text-blue-800 placeholder:text-blue-400 rounded-lg"
                />
              </div>
            )}

            <Button
              onClick={isLogin ? handleLogin : handleRegister}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white text-md py-2 rounded-xl shadow-lg"
            >
              {isLogin ? "Enter Kitchen" : "Register as AI Chef"}
            </Button>

            <div className="text-sm text-center text-blue-700 pt-2">
              {isLogin ? (
                <span>
                  New to the AI Kitchen?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Become a Chef
                  </button>
                </span>
              ) : (
                <span>
                  Already connected?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Return to Login
                  </button>
                </span>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default Login;
