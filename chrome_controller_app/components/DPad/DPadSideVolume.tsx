import { DPadSide } from './DPadSide'
import { Plus, Minus, Volume2, LucideIcon } from 'lucide-react-native'
import { sendMute, sendVolume } from '@/server/socket'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/contexts/appContext'
import { VOLUME_SIDE_ANGLES } from './constants'
import { useRemoteButton } from '@/hooks/useRemoteButton'
import { RemoteContext } from '@/contexts/remoteContext'

export const DPadSideVolume = () => {
    const { server } = useContext(AppContext);
    const { commands } = useContext(RemoteContext);
    const volumeStep = 5;

    const onPressArray = [
        useRemoteButton(server.ip, commands.volume.down, commands.directions),
        useRemoteButton(server.ip, commands.volume.mute, commands.directions),
        useRemoteButton(server.ip, commands.volume.up, commands.directions)
    ];

    return (
        <DPadSide startAngle={VOLUME_SIDE_ANGLES.startAngle} endAngle={VOLUME_SIDE_ANGLES.endAngle} onPressArray={onPressArray}/>
    )
}