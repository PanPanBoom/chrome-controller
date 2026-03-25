import { Dimensions, FlatList, Pressable, ScrollView, ScrollViewProps, View, ViewProps } from "react-native"
import { Show } from "./Show";
import { useContext, useEffect, useState } from "react";
import { cn } from "@/etc/utils";
import { getTopShows } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";
import { CustomText } from "./ui/CustomText";
import { ShowDTO } from "@/dtos/show";
import { ShowCarouselFilter } from "./ShowCarouselFilter";
import { TextButton } from "./ui/TextButton";
import { ShowCarouselFilterGroup } from "./ShowCarouselFilterGroup";
import { App } from "@/dtos/app";

type ShowCarouselProps = ViewProps & {
    platform: App;
}

export const ShowCarousel = ({className, ...props}: ShowCarouselProps) => {
    const { server } = useContext(AppContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const [shows, setShows] = useState<ShowDTO[]>([]);
    const [currentFilter, setCurrentFilter] = useState('');

    const { width } = Dimensions.get('screen');

    const SHOW_WIDTH = Math.round(width * 0.85);
    const SPACING = 25;
    const NB_SHOWS_DISPLAYED = 3;

    useEffect(() => {
        if(props.platform)
            getTopShows(server.ip, props.platform.name, currentFilter)
                .then(res => res.json())
                .then(dataFetched => setShows(dataFetched));
    }, [props.platform, currentFilter]);

    const handleNext = () => setActiveIndex(i => {
        if(i + 1 > shows.length - 1) return 0;
        
        return i + 1;
    });

    const handlePrev = () => setActiveIndex(i => {
        if(i - 1 < 0) return shows.length - 1;

        return i - 1;
    })

    const handleFilterChange = (filter: string) => {
        setCurrentFilter(filter);
    }

    return (
        <View className={cn("gap-3", className)} {...props}>
            <ShowCarouselFilterGroup filters={props.platform.filters} onFilterChange={handleFilterChange}/>
            <View className="flex-row">
                {
                    shows &&
                    [...shows].reverse().map((show, reversedIndex) => {
                        const index = shows.length - 1 - reversedIndex;
                        let position = index - activeIndex;
                        if(position < 0)
                            position += shows.length;

                        if (position < 0 || position > NB_SHOWS_DISPLAYED - 1) return null;
                        
                        return (
                            <View
                                key={index}
                                className="h-full"
                                style={{
                                    width: SHOW_WIDTH,
                                    position: position === 0 ? 'relative' : 'absolute',
                                    right: -(position * SPACING),
                                    transform: [{ scale: 1 - position * 0.1}],
                                    zIndex: NB_SHOWS_DISPLAYED - position
                                }}
                            >
                                <Show 
                                    data={show} 
                                    onPrev={position === 0 ? handlePrev : undefined} 
                                    onNext={position === 0 ? handleNext : undefined}
                                />
                            </View>
                        )
                    })
                }
            </View>
        </View>
    )
}