import { CustomText } from "@/components/ui/CustomText";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { AppContext } from "@/contexts/appContext";
import { ShowDTO } from "@/dtos/show";
import { searchShow, sendAppLaunch } from "@/server/socket";
import { ChevronRight } from "lucide-react-native";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, TextInput, View } from "react-native";

export default function Streaming()
{
    const { server } = useContext(AppContext);

    const [input, setInput] = useState("");
    const [shows, setShows] = useState<ShowDTO[]>([]);

    const fetchShows = () => {
        searchShow(server.ip, input)
        .then(res => res.json())
        .then(fetchedShows => setShows(fetchedShows));
    }

    useEffect(() => {
        console.log(shows);
    }, [shows])

    return (
        <Screen className="gap-4">
            <CustomTitle>Streaming</CustomTitle>
            <TextInput
                className="w-full p-4 bg-black/50 text-xl text-text" 
                value={input}
                onChangeText={setInput}
                returnKeyType="search"
                onSubmitEditing={fetchShows}
            />
            <FlatList 
                data={shows}
                renderItem={({ item }) => 
                    <Pressable className="flex-1 flex-row p-2 justify-between" onPress={() => sendAppLaunch(server.ip, "https://noxpulse.cc/watch/" + item.tmdbId)}>
                        <Image source={{uri: item.img}} className="h-full aspect-square"/>
                        <CustomText>{item.title}</CustomText>
                        <ChevronRight color={colors.text}/>
                    </Pressable>
                }
                keyExtractor={show => show.id}
            />
        </Screen>
    )
}