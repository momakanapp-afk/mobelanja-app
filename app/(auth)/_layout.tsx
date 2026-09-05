
import { useAuth } from "@clerk/expo";
import { Stack } from "expo-router";

export default function AuthRoutesLayout() {

  const { isSignedIn, isLoaded } = useAuth();
  
  if (isLoaded) {
    if (!isSignedIn) {
      return <Stack screenOptions={{ headerShown: false }} />;
    }
  }
}
