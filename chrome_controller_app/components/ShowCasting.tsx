import { ScrollView, View, Image } from "react-native"
import { CustomTitle } from "./ui/CustomTitle"
import { CastDTO } from "@/dtos/show";
import { LinearGradient } from "expo-linear-gradient";
import { CustomText } from "./ui/CustomText";
import { Button } from "./ui/Button";
import { router } from "expo-router";

type ShowCastingProps = {
    cast: CastDTO;
}

export const ShowCasting = (props: ShowCastingProps) => {
    if(!props.cast || props.cast.length === 0)
        return (<></>);

    const handlePress = (actorId: string) => {
        const [mediaType, realId] = actorId.split('/');
        router.push(`/show/${realId}?mediaType=${mediaType}`);
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {
                props.cast.map(actor => (
                    <Button key={actor.id} className="items-center gap-2 w-28 mx-2 p-0 bg-transparent" onPress={() => handlePress(actor.id)}>
                        <View className="w-full aspect-square rounded-xl overflow-hidden">
                            <Image source={{uri: actor.img}} className="w-full aspect-square" />
                            <LinearGradient colors={['rgba(0, 0, 0, 0)', "rgba(0, 0, 0, 0.8)"]} style={{position: "absolute", bottom: 0, left: 0, width: '100%', height: '100%'}} />
                            <View className="absolute bottom-0 left-0 p-2 w-full items-center">
                                <CustomText className="text-xs text-center">{actor.name}</CustomText>
                                {
                                    actor.character?.length > 0 &&
                                    <CustomText className="text-[7px] text-secondary text-center">{actor.character}</CustomText>
                                }
                            </View>
                        </View>
                    </Button>
                ))
            }
        </ScrollView>
    )
}