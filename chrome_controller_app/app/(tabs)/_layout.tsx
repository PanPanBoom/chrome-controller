import { Tabs } from "expo-router";
import { Banknote, Cast, LucideIcon, LucideProps, TvMinimalPlay } from "lucide-react-native";
import { JSX } from "react";
import { colors } from "@/constants/colors";

export default function TabLayout()
{
    const TabIcon = (Element: LucideIcon, color: string, props?: (JSX.IntrinsicAttributes & LucideProps)) => <Element size={30} strokeWidth={1.2} color={color} {...props} />;

    return (
        
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: colors.background },
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary
            }}>
                <Tabs.Screen name="remote" options={{
                    tabBarIcon: ({ color }) => TabIcon(Banknote, color, {style: {transform: [{rotate: "90deg"}]}}),
                }}/>
                <Tabs.Screen name="apps" options={{
                    tabBarIcon: ({ color }) => TabIcon(TvMinimalPlay, color)
                }}/>
                <Tabs.Screen name="cast" options={{
                    tabBarIcon: ({ color }) => TabIcon(Cast, color)
                }}/>
            </Tabs>
        
    )
}