import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils";
import { Dimensions, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Screen = ({className, style, ...props}: ViewProps) => {
    const insets = useSafeAreaInsets();
    const { width, height } = Dimensions.get('window');

    const offset = 100;

    return (
        <View className="flex-1 bg-background">
            <View className="bg-background aspect-square w-[50%] shadow absolute" style={{shadowColor: colors.primary, shadowRadius: 130, shadowOffset: {width: -offset, height: offset}, left: width - 1, bottom: height - 1}}/>
            <View className={cn("px-8 py-4 flex-1", className)} style={[{paddingTop: insets.top}, style]} {...props}>
                {props.children}
            </View>
        </View>
    )
}