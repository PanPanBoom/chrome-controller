import { Tabs } from "expo-router";
import { Banknote, Cast, LucideIcon, LucideProps, TvMinimalPlay } from "lucide-react-native";
import { JSX } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";

export default function TabLayout()
{
    const TabIcon = (Element: LucideIcon, props?: (JSX.IntrinsicAttributes & LucideProps)) => <Element size={30} strokeWidth={1.2} color={colors.secondary} {...props} />;

    return (
        
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: colors.background },
                tabBarShowLabel: false,
            }}>
                <Tabs.Screen name="remote" options={{
                    tabBarIcon: () => TabIcon(Banknote, {style: {transform: [{rotate: "0deg"}]}}),
                }}/>
                <Tabs.Screen name="apps" options={{
                    tabBarIcon: () => TabIcon(TvMinimalPlay)
                }}/>
                <Tabs.Screen name="cast" options={{
                    tabBarIcon: () => TabIcon(Cast)
                }}/>
            </Tabs>
        
    )
}