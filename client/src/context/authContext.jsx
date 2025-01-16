import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        console.log("Initial storedUser:", storedUser);
        return storedUser ? JSON.parse(storedUser) : null;
      });

  const login = () => {
    // Simuler un appel API et mettre à jour l'état de l'utilisateur
    const newUser = {
      id: 1,
      name: "Valentin Dauvier",
      profilePic: "https://images.pexels.com/photos/3228727/pexels-photo-3228727.jpeg?auto=compress&cs=tinysrgb&w=1600",
    };
    console.log("Logging in user:", newUser);
    setCurrentUser(newUser);
  };

  useEffect(() => {
    console.log("currentUser changed:", currentUser);
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
      console.log("User saved to localStorage:", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
      console.log("User removed from localStorage");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};