import { DPadSide } from './DPadSide'
import { Plus, Minus, Volume2, LucideIcon } from 'lucide-react-native'
import { sendVolume } from '@/server/socket'
import { useContext } from 'react'
import { AppContext } from '@/contexts/appContext'

export const DPadSideVolume = () => {
    const { serverIp } = useContext(AppContext);
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
        <DPadSide startAngle={240} endAngle={300} icons={icons}/>
    )
}