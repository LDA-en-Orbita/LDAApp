import { WelcomeScreen } from "@/src/views/WelcomeScreen";
import { Stack, useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WelcomeScreen navigation={router} />
    </>
  );
}