import { DeviceDataDTO } from "@/dtos/deviceData";
import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { ServerDataDTO } from "@/dtos/serverData";
import { socketClient } from "@/server/SocketClient";
import { createContext, useState } from "react";

export const AppContext = createContext({
    server: {} as ServerDataDTO,
    setServer: (server: ServerDataDTO) => {},
    device: {} as DeviceDataDTO,
    setDevice: (device: DeviceDataDTO) => {}
});

export const AppProvider = ({ children }: any) => {
    const [serverData, setServerData] = useState({} as ServerDataDTO);
    const [device, setDevice] = useState({} as DeviceDataDTO);

    const setServer = (server: ServerDataDTO) => {
        setServerData(server);
        socketClient.connect(`http://${server.ip}:3000`, { transports: ['websocket'] });
    }

    return (
        <AppContext.Provider value={{ server: serverData, setServer, device, setDevice }}>
            {children}
        </AppContext.Provider>
    );
}