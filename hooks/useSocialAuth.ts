import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const {startSSOFlow} = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google"|"oauth_facebook") => {
    setLoadingStrategy(strategy);
    try {
      const {createdSessionId, setActive} = await startSSOFlow({strategy});
      if (createdSessionId && setActive) {
        await setActive({session: createdSessionId});
      }
    } catch (error) {
      console.log("Eror saat login",error);
      Alert.alert("Error","Gagal saat memproses login");
    } finally {
      setLoadingStrategy(null);
    }
  }

  return {loadingStrategy, handleSocialAuth}
}

export default useSocialAuth