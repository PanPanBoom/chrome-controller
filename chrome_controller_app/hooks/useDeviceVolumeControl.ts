import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { sendKeyPress } from "@/server/socket";
import { useEffect, useRef } from "react";
import { EmitterSubscription } from "react-native";
import Constants, { ExecutionEnvironment } from "expo-constants";

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let VolumeManager: any = null;
if(!isExpoGo)
{
    try {
        VolumeManager = require("react-native-volume-manager").VolumeManager;
    } catch (e) {
        console.log(e);
    }
}

export const useDeviceVolumeControl = (ip: string, constants: remoteConstantsDTO) => {
    const prevVolume = useRef(0.5);

    useEffect(() => {
        if(isExpoGo || !VolumeManager)
            return;

        let volumeListener: EmitterSubscription;

        const timer = setTimeout(async () => {
            try {
                VolumeManager.showNativeVolumeUI({ enabled: false });
    
                await VolumeManager.setVolume(0.5);
        
                volumeListener = VolumeManager.addVolumeListener((result: any) => {
                    const currentVolume = result.volume;
        
                    sendKeyPress(ip, currentVolume > prevVolume.current ? constants.volume.up : constants.volume.down, constants.directions.shortPress);
        
                    prevVolume.current = currentVolume;
                    if(currentVolume >= 0.8 || currentVolume <= 0.2){
                        VolumeManager.setVolume(0.5);
                        prevVolume.current = 0.5;
                    }
                });
            } catch(err) {
                console.log('VolumeManager error:' + err);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            volumeListener?.remove();
            VolumeManager.showNativeVolumeUI({ enabled: true });
        }
    })
}