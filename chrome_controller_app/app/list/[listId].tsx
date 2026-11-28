import { ShowsList } from "@/components/ui/ShowsList";
import { CustomTitle } from "@/components/ui/CustomTitle";
import { Screen } from "@/components/ui/Screen";
import { ScrollScreen } from "@/components/ui/ScrollScreen";
import { AppContext } from "@/contexts/appContext";
import { ShowListDTO } from "@/dtos/show";
import { getListById } from "@/server/api";
import { router, useLocalSearchParams } from "expo-router"
import { useContext, useEffect, useState } from "react";
import { Pagination } from "@/components/ui/Pagination";
import { ActivityIndicator, View } from "react-native";
import { IconButton } from "@/components/ui/IconButton";
import { ChevronLeft } from "lucide-react-native";

export default function List()
{
    const { listId, mediaType } = useLocalSearchParams<{ listId: string, mediaType: string }>();
    const { server } = useContext(AppContext);
    const [shows, setShows] = useState<{
        title: string;
        total_pages: number;
        shows: ShowListDTO[];
    }>();
    const [page, setPage] = useState(1);

    useEffect(() => {
        getListById(server.ip, 'tmdb', listId, mediaType, page)
            .then(res => res.json())
            .then(data => setShows(data));
    }, [page]);

    return (
        <ScrollScreen className="gap-4">
            <View className="flex-row items-center justify-between">
                <IconButton icon={ChevronLeft} onPress={() => router.back()} />
                <CustomTitle>{shows?.title}</CustomTitle>
                <IconButton icon={ChevronLeft} style={{opacity: 0}}/>
                {/* Here to center title */}
            </View>
            {
                shows ?
                <>
                    <Pagination className="justify-center" maxPage={shows?.total_pages} currentPage={page} onPageChange={setPage} />
                    {
                        shows?.shows &&
                        <ShowsList shows={shows?.shows} />
                    }
                    <Pagination className="justify-center" maxPage={shows?.total_pages} currentPage={page} onPageChange={setPage} />
                </>
                :
                <ActivityIndicator />
            }
        </ScrollScreen>
    )
}