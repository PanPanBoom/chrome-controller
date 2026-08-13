import { useState } from "react";
import { Pressable, View } from "react-native";
import { CustomText } from "./CustomText";

type TabsProps = {
    tabs: Record<string, React.ReactNode>;
}

export const Tabs = ({ tabs }: TabsProps) => {
    const [tabSelectedIndex, setTabSelectedIndex] = useState(0);

    return (
        <View>
            <View className="flex-row">
                {
                    Object.keys(tabs).map((tab, index) => (
                        <Pressable key={tab} onPress={() => setTabSelectedIndex(index)} className={`flex-1 p-4 items-center border-b-2 ${index === tabSelectedIndex ? 'border-primary' : 'border-background-hover'}`}>
                            <CustomText className={`text-lg ${index === tabSelectedIndex ? 'text-primary' : 'text-text'}`}>{tab}</CustomText>
                        </Pressable>
                    ))
                }
            </View>
            <View className="px-8 py-4 flex-1">
                {Object.entries(tabs).map(([key, value], index) => (
                    <View key={key} style={{ display: index === tabSelectedIndex ? 'flex' : 'none' }} className="flex-1 gap-4">
                        {value}
                    </View>
                ))}
            </View>
        </View>
    )
}