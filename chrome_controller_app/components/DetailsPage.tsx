import { ScrollView, View, Image } from "react-native"
import { ShowHeader, ShowHeaderProps } from "./ShowHeader"
import { Tabs, TabsProps } from "./ui/Tabs"
import React from "react";
import { IconButton } from "./ui/IconButton";
import { ChevronLeft, Heart } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DetailsPageProps = ShowHeaderProps & {
    tabs: TabsProps['tabs'];
}

export const DetailsPage = ({tabs, children, ...props}: DetailsPageProps) => {
    const insets = useSafeAreaInsets();
    
    return (
        <View className="bg-background flex-1 relative">
            <Image source={{uri: props.img}} className="w-full aspect-[2/3] absolute top-0 left-0 right-0"/>
            <ScrollView className="flex-1" contentContainerStyle={{paddingTop: '100%'}} showsVerticalScrollIndicator={false} >
                <ShowHeader {...props}>
                    {children}
                </ShowHeader>
                <Tabs tabs={tabs}/>
            </ScrollView>
            <View className="flex-row w-full px-6 justify-between absolute" style={{top: insets.top}}>
                <IconButton icon={ChevronLeft} onPress={() => router.back()} />
                <IconButton icon={Heart} />
            </View>
        </View>
    )
}