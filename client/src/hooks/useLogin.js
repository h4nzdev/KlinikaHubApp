import { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import patientAuthServices from "../services/patientAuthServices";
import { AuthenticationContext } from "../context/AuthenticationContext";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(AuthenticationContext);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const auth = await patientAuthServices.patientLogin(email, password);
      setUser(auth.patient);

      const timer = setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Logged in successfully",
        });
      }, 3500);

      return auth.patient;
    } catch (error) {
      // Use the specific error message from the AuthController
      const errorMessage = error.message;

      // Show the specific error message without generic "Login failed"
      Toast.show({
        type: "error",
        text1: errorMessage, // Show the specific error as main text
      });

      // Re-throw the error in case the component needs to handle it
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
