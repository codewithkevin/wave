import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/(auth)");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return { signOut: handleSignOut };
};
