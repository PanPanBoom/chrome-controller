import { View, Text, ActivityIndicator } from "react-native";
import * as Network from 'expo-network';
import { useContext, useEffect, useState } from "react";
import { Loader } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { TextButton } from "@/components/ui/TextButton";
import { AppContext } from "@/contexts/appContext";
import { sendPing } from "@/server/socket";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { serverIp, setServerIp } = useContext(AppContext);

  const scanNetwork = async () => {
    setLoading(true);

    const ipAddress = await Network.getIpAddressAsync();
    const baseIp = ipAddress.substring(0, ipAddress.lastIndexOf('.'));
    
    console.log(`Scanning network ${baseIp}.x ...`);

    const promises = [];
    for(let i = 1; i <= 254; i++)
    {
      const targetIp = `${baseIp}.${i}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 200);

      promises.push(
        sendPing(targetIp, controller.signal)
          .then(res => res.text())
          .then(text => {
            if(text === 'pong') return targetIp;
            return null;
          })
          .catch(() => null)
      );
    }

    const results = await Promise.all(promises);
    const foundServers = results.filter(ip => ip !== null);

    console.log('Serveurs trouvés :', foundServers);

    setLoading(false);
    if(foundServers.length > 0)
    {
      setServerIp(foundServers[0]);
      router.push({ pathname: '/(tabs)/remote' });
    }
  }

  useEffect(() => {
    scanNetwork();
  }, []);

  return (
    <View className="flex flex-1 justify-center items-center">
      {
        loading ?
        <View>
          <ActivityIndicator />
          <Text>Recherche de serveurs...</Text>
        </View> :
        <View className="flex justify-center items-center gap-4">
          <Text>Aucun serveur trouvé</Text>
          <TextButton onPressOut={scanNetwork} className="w-[75%]">Rechercher</TextButton>
        </View>
      }
    </View>
  );
}