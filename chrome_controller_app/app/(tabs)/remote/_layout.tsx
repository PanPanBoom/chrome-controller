import { RemoteProvider } from "@/contexts/remoteContext";
import { Stack } from "expo-router";

export default function RemoteLayout()
{
    return (
        <RemoteProvider>
            <Stack screenOptions={{ headerShown: false }}/>
        </RemoteProvider>
    )
}