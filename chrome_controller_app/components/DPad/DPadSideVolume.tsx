import { DPadSide } from './DPadSide'
import { Plus, Minus, Volume2, LucideIcon } from 'lucide-react-native'
import { sendMute, sendVolume } from '@/server/socket'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/appContext'
import { VOLUME_SIDE_ANGLES } from './constants'

type DPadSideVolumeProps = {
    onMuteChange: (isMuted: boolean) => void;
}

export const DPadSideVolume = (props: DPadSideVolumeProps) => {
    const { server } = useContext(AppContext);
    const volumeStep = 5;

    const onPressArray = [
        () => sendVolume(server.ip, -volumeStep),
        () => sendMute(server.ip).then(res => res.json()).then(data => props.onMuteChange(data.isMuted)),
        () => sendVolume(server.ip, volumeStep)
    ];

    return (
        <DPadSide startAngle={VOLUME_SIDE_ANGLES.startAngle} endAngle={VOLUME_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/>
    )
}