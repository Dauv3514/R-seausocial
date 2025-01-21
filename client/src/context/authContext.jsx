import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        console.log("Initial storedUser:", storedUser);
        return storedUser ? JSON.parse(storedUser) : null;
      });

  const login = async (inputs) => {
    try {
        const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
            withCredentials: true,
        });
        setCurrentUser(res.data);
        return res; // Assurez-vous de renvoyer la réponse
    } catch (err) {
        console.error("Erreur dans la fonction login:", err);
        throw err; // Renvoyer l'erreur pour qu'elle soit capturée par handleLogin
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};