import { DPadSide } from './DPadSide'
import { Plus, Minus, Volume2, LucideIcon } from 'lucide-react-native'
import { sendVolume } from '@/server/socket'
import { useContext } from 'react'
import { AppContext } from '@/contexts/appContext'
import { VOLUME_SIDE_ANGLES } from './DPadSides'

export const DPadSideVolume = () => {
    const { server } = useContext(AppContext);
    const volumeStep = 5;

    const onPressArray = [
        () => sendVolume(server.ip, -volumeStep),
        () => console.log("mute"),
        () => sendVolume(server.ip, volumeStep)
    ];

    return (
        <DPadSide startAngle={VOLUME_SIDE_ANGLES.startAngle} endAngle={VOLUME_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/>
    )
}

export const volumeIcons = [ Minus, Volume2, Plus ]