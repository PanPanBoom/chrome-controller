import { Dimensions, FlatList, Pressable, ScrollView, ScrollViewProps, View, ViewProps } from "react-native"
import { Show } from "./Show";
import { useContext, useEffect, useState } from "react";
import { cn } from "@/etc/utils";
import { getTopShows } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";
import { CustomText } from "./ui/CustomText";
import { ShowDTO } from "@/dtos/show";

export const ShowCarousel = ({className, ...props}: ViewProps) => {
    const { server } = useContext(AppContext);
    const [activeIndex, setActiveIndex] = useState(0);
    const [data, setData] = useState<ShowDTO[]>([]);

    const { width } = Dimensions.get('screen');

    const SHOW_WIDTH = Math.round(width * 0.85);
    const SPACING = 25;
    const NB_SHOWS_DISPLAYED = 3;

    useEffect(() => {
        getTopShows(server.ip)
            .then(res => res.json())
            .then(dataFetched => setData(dataFetched));
    }, []);

    const handleNext = () => {
        setActiveIndex(i => {
            if(i + 1 > data.length - 1) return 0;
            
            return i + 1;
        })
    }

    return (
        <View className={cn("flex-row", className)} {...props}>
            {
                data &&
                [...data].reverse().map((show, reversedIndex) => {
                    const index = data.length - 1 - reversedIndex;
                    let position = index - activeIndex;
                    if(position < 0)
                        position += data.length;

                    if (position < 0 || position > NB_SHOWS_DISPLAYED - 1) return null;
                    
                    return (
                        <Pressable 
                            key={index} 
                            onPress={position === 0 ? handleNext : undefined}
                            className="absolute h-full"
                            style={{
                                width: SHOW_WIDTH,
                                position: position === 0 ? 'relative' : 'absolute',
                                right: -(position * SPACING),
                                transform: [{ scale: 1 - position * 0.1}],
                                zIndex: NB_SHOWS_DISPLAYED - position
                            }}
                        >
                            <Show data={show}/>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}