import { useAuth } from '@clerk/expo';
import { Redirect } from 'expo-router';

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useAuth();

  if (isSignedIn && isLoaded) {
    return <Redirect href={"/(tabs)"} />;
  }
}