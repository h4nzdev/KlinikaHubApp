import { useState, useContext } from "react";
import Toast from "react-native-toast-message";
import patientAuthServices from "../services/patientAuthServices";
import { AuthenticationContext } from "../context/AuthenticationContext";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthenticationContext);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    try {
      const auth = await patientAuthServices.patientLogin(email, password);

      // Simply store the user data without token
      await login(auth.patient);

      setTimeout(() => {
        Toast.show({
          type: "success",
          text1: "Logged in successfully",
        });
      }, 3500);

      return auth.patient;
    } catch (error) {
      const errorMessage = error.message;
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
