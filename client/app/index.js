import React, { useContext } from "react";
import { Redirect } from "expo-router";
import SplashScreen from "../src/screens/SplashScreen";
import { AuthenticationContext } from "../src/context/AuthenticationContext";

export default function Index() {
  const { user } = useContext(AuthenticationContext);
  const [isReady, setIsReady] = React.useState(false);

  if (!isReady) {
    return <SplashScreen onFinish={() => setIsReady(true)} />;
  }

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}
