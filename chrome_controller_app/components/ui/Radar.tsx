import { colors } from "@/constants/colors";
import { cn } from "@/etc/utils"
import { Banknote, Computer } from "lucide-react-native";
import { useEffect } from "react";
import { Animated, Easing, useAnimatedValue, View, ViewProps } from "react-native"

type RadarProps = ViewProps & {
  active: boolean;
  setCenterRadius: (radius: number) => void;
}

export const Radar = ({className, ...props}: RadarProps) => {
  const lineStyle = "aspect-square border border-background-hover rounded-full justify-center items-center";

  const rotationAnim = useAnimatedValue(0);
  const maxValue = 360;
  
  useEffect(() => {
    if(props.active)
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: maxValue,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear
      })).start();
    else
    {
      rotationAnim.stopAnimation();
      rotationAnim.setValue(0);
    }
  }, [props.active]);
    

  return (
    <View className={cn("aspect-square border border-dashed border-primary rounded-full bg-background-light justify-center items-center", className)} {...props}>
      <View className={`w-[85%] ${lineStyle}`}>
        <View className={`w-[75%] ${lineStyle}`}>
          <View className={`w-[65%] ${lineStyle}`}>
            <View className="bg-primary z-50 aspect-square w-[55%] rounded-full justify-center items-center" onLayout={e => props.setCenterRadius(e.nativeEvent.layout.width/2)}>
              <Banknote fill={colors.secondary} color={colors.text} strokeWidth={1} size={40} style={{transform: [{rotate: "90deg"}]}}/>
            </View>
          </View>
        </View>
      </View>
      { props.children }
      {
        props.active && 
        <Animated.View className="absolute w-1/2 border border-primary right-0 top-1/2" style={{shadowColor: colors.primary, shadowRadius: 3, shadowOpacity: 1, shadowOffset: { width: 0, height: -3}, transformOrigin: 'left center', transform: [{rotate: rotationAnim.interpolate({
          inputRange: [0, maxValue],
          outputRange: ['0deg', `${maxValue}deg`]
        })}]}}/>
      }
    </View>
  )
}