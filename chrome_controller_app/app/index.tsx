import { ActivityIndicator } from "react-native";
import { useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { AppContext } from "@/contexts/appContext";
import { Screen } from "@/components/ui/Screen";
import { CustomText } from "@/components/ui/CustomText";
import { scanNetwork } from "@/etc/utils";
import { ServerDataDTO } from "@/dtos/serverData";

export default function Index() {
  const router = useRouter();
  const { server, setServer } = useContext(AppContext);

  useEffect(() => {
    const launchScanNetwork = async () => {
      const foundServers: ServerDataDTO[] = await scanNetwork();
      if(foundServers.length > 0)
      {
        setServer(foundServers[0]);
        router.push({ pathname: '/(tabs)/remote' });
      }

      else
        router.push({ pathname: '/(tabs)/cast'});
    }

    launchScanNetwork();
  }, []);

  return (
    <Screen className="flex justify-center items-center gap-4">
        <ActivityIndicator />
        <CustomText>Recherche de serveurs...</CustomText>
    </Screen>
  );
}