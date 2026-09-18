import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { sendKeyPress } from "@/server/socket";
import { useEffect, useRef } from "react";
import { VolumeManager } from "react-native-volume-manager";

export const useDeviceVolumeControl = (ip: string, constants: remoteConstantsDTO) => {
    const prevVolume = useRef(0.5);

    useEffect(() => {
        VolumeManager.showNativeVolumeUI({ enabled: false });
        VolumeManager.setVolume(0.5);

        const volumeListener = VolumeManager.addVolumeListener((result) => {
            const currentVolume = result.volume;

            sendKeyPress(ip, currentVolume > prevVolume.current ? constants.volume.up : constants.volume.down, constants.directions.shortPress);

            prevVolume.current = currentVolume;
            if(currentVolume >= 0.8 || currentVolume <= 0.2){
                VolumeManager.setVolume(0.5);
                prevVolume.current = 0.5;
            }
        });

        return () => {
            volumeListener.remove();
            VolumeManager.showNativeVolumeUI({ enabled: true });
        }
    })
}