import { DPadSide } from './DPadSide'
import { Plus, Minus, Volume2, LucideIcon } from 'lucide-react-native'
import { sendVolume } from '@/server/socket'
import { useContext } from 'react'
import { AppContext } from '@/contexts/appContext'
import { VOLUME_SIDE_ANGLES } from './DPadSides'

export const DPadSideVolume = () => {
    const { serverIp } = useContext(AppContext);
    const volumeStep = 5;

    const onPressArray = [
        () => sendVolume(serverIp, -volumeStep),
        () => console.log("mute"),
        () => sendVolume(serverIp, volumeStep)
    ];

    return (
        <DPadSide startAngle={VOLUME_SIDE_ANGLES.startAngle} endAngle={VOLUME_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/>
    )
}

export const volumeIcons = [ Minus, Volume2, Plus ]