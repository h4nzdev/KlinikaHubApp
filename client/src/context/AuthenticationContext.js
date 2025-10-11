import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user on app start
  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      // Store user data in AsyncStorage
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear user data from storage
      await AsyncStorage.removeItem("userData");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const updateUser = async (updatedUserData) => {
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(updatedUserData));
      setUser(updatedUserData);
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
