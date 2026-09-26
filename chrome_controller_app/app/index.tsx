import { ActivityIndicator } from "react-native";
import { useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { AppContext } from "@/contexts/appContext";
import { Screen } from "@/components/ui/Screen";
import { CustomText } from "@/components/ui/CustomText";
import { scanNetwork } from "@/etc/utils";
import { ServerDataDTO } from "@/dtos/serverData";
import { sendPing } from "@/server/api";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const { setServer } = useContext(AppContext);
  const { getItem, setItem } = useAsyncStorage('@lastServerIp');

  useEffect(() => {
    const launchScanNetwork = async () => {
      const foundServers: ServerDataDTO[] = await scanNetwork();
      if(foundServers.length > 0)
      {
        setItem(foundServers[0].ip);
        setServer(foundServers[0]);
        router.push({ pathname: '/(tabs)/remote' });
      }

      else
        router.push({ pathname: '/(tabs)/cast'});
    }

    getItem()
      .then(lastServerIp => {
        console.log("Got last server IP");
        if(lastServerIp)
          sendPing(lastServerIp)
            .then(res => res.json())
            .then(data => {
              console.log("Ping response");
              setItem(lastServerIp);
              setServer({
                ip: lastServerIp,
                serverData: data
              });
              router.push({ pathname: '/(tabs)/remote' });
            })
            .catch(launchScanNetwork);
        else
          launchScanNetwork();
      })
  }, []);

  return (
    <Screen className="flex justify-center items-center gap-4">
        <ActivityIndicator />
        <CustomText>Recherche de serveurs...</CustomText>
    </Screen>
  );
}