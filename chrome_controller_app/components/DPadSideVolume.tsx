import { View, ViewProps } from 'react-native'
import { DPadSide } from './DPadSide'
import { Plus, Minus, Volume2, LucideIcon } from 'lucide-react-native'
import { sendVolume } from '@/server/socket'
import { useContext } from 'react'
import { AppContext } from '@/contexts/appContext'
import { colors } from '@/constants/colors'
import { polarToCartesian } from './ui/CurvedPanel'

export const DPadSideVolume = (props: ViewProps) => {
    const { serverIp } = useContext(AppContext);
    const startAngle = 240;
    const endAngle = 300;
    const volumeStep = 5;

    const icons = [
        {
            icon: Minus,
            onPress: () => sendVolume(serverIp, -volumeStep)
        },
        {
            icon: Volume2,
            onPress: () => console.log("mute")
        },
        {
            icon: Plus,
            onPress: () => sendVolume(serverIp, volumeStep)
        }
    ]

    return (
        <DPadSide startAngle={startAngle} endAngle={endAngle} icons={icons} {...props}/>
    )
}