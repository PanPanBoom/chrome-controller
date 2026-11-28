import { ShowListDTO } from "@/dtos/show";
import { Image, View } from "react-native";
import { Button } from "./Button";
import { ChevronRight } from "lucide-react-native";
import { CustomText } from "./CustomText";
import { colors } from "@/constants/colors";
import { Href, router } from "expo-router";
type ShowsListProps = {
    shows: ShowListDTO[];
}

export const ShowsList = (props: ShowsListProps) => {
    const handlePress = (showId: string) => {
        const [mediaType, realId] = showId.split('/');
        router.navigate(`/show/${realId}?mediaType=${mediaType}` as Href);
    }

    return (
        <>
            {
                props.shows
                    .map(show => 
                        <Button key={show.id} className="w-full justify-between flex-row bg-transparent" onPress={() => handlePress(show.id)}>
                            {
                                show.img ?
                                <Image source={{uri: show.img}} className="aspect-[2/3] w-1/4 rounded-xl" /> :
                                <View className="w-1/4"/>
                            }
                            <View className="px-6 flex-1 items-center gap-1">
                                <CustomText numberOfLines={2} className="text-center text-lg">{show.title + (show.releaseDate ? ` (${show.releaseDate.slice(-4)})` : '')}</CustomText>
                                {
                                    show.info &&
                                    <CustomText className="text-secondary text-sm text-center">{show.info}</CustomText>
                                }
                            </View>
                            <ChevronRight color={colors.text} />
                        </Button>
                )
            }
        </>
    )
}