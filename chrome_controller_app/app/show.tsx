import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen"
import { ShowDTO } from "@/dtos/show"
import { useLocalSearchParams } from "expo-router";

export default function Show()
{
    const { data } = useLocalSearchParams();
    const show: ShowDTO = JSON.parse(decodeURIComponent(data as string));

    return (
        <Screen>
            <CustomTitle>{show.title}</CustomTitle>
        </Screen>
    )
}