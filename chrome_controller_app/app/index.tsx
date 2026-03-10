import { View, Text, ActivityIndicator } from "react-native";
import * as Network from 'expo-network';
import { useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { AppContext } from "@/contexts/appContext";
import { sendPing } from "@/server/socket";
import { Screen } from "@/components/ui/Screen";
import { CustomText } from "@/components/ui/CustomText";
import { scanNetwork } from "@/etc/utils";
import { ServerDataDTO } from "@/dtos/serverData";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { server, setServer } = useContext(AppContext);

  const launchScanNetwork = async () => {
    setLoading(true);
    const foundServers: ServerDataDTO[] = await scanNetwork();
    setLoading(false);
    if(foundServers.length > 0)
    {
      setServer(foundServers[0]);
      router.push({ pathname: '/(tabs)/remote' });
    }
  }

  useEffect(() => {
    launchScanNetwork();
  }, []);

  return (
    <Screen className="flex justify-center items-center gap-4">
      {
        loading ?
        <>
          <ActivityIndicator />
          <CustomText>Recherche de serveurs...</CustomText>
        </> :
        <>
          <CustomText>Aucun serveur trouvé</CustomText>
          <Button onPressOut={launchScanNetwork} className="w-[75%]">
            <CustomText>Rechercher</CustomText>
          </Button>
        </>
      }
    </Screen>
  );
}