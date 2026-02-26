import { Tabs } from "expo-router";
import { Banknote, Cast, LucideIcon, LucideProps, TvMinimalPlay } from "lucide-react-native";
import { JSX } from "react";
import { colors } from "@/constants/colors";

export default function TabLayout()
{
    const TabIcon = (Element: LucideIcon, color: string, props?: (JSX.IntrinsicAttributes & LucideProps)) => <Element size={35} strokeWidth={1} color={color} {...props} />;

    return (
        
            <Tabs screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: colors.backgroundLight, borderTopWidth: 0, paddingBottom: 0, height: "13%" },
                tabBarShowLabel: false,
                tabBarActiveBackgroundColor: colors.backgroundHover,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                tabBarItemStyle: { borderRadius: 40, overflow: "hidden", marginHorizontal: 30, marginBottom: 25, marginTop: 10 },
                tabBarIconStyle: { flex: 1, alignItems: "center", justifyContent: "center" }
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