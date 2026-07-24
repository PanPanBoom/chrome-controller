import { DeviceDataDTO } from "@/dtos/deviceData";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { ServerDataDTO } from "@/dtos/serverData";
import { createContext, useState } from "react";

export const AppContext = createContext({
    server: {} as ServerDataDTO,
    setServer: (server: ServerDataDTO) => {},
    device: {} as DeviceDataDTO,
    setDevice: (device: DeviceDataDTO) => {}
});

export const AppProvider = ({ children }: any) => {
    const [server, setServer] = useState({} as ServerDataDTO);
    const [device, setDevice] = useState({} as DeviceDataDTO);

    return (
        <AppContext.Provider value={{ server, setServer, device, setDevice }}>
            {children}
        </AppContext.Provider>
    );
}