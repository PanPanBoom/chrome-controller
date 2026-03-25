import { remoteConstantsDTO } from "@/dtos/remoteConstants";
import { createContext, useState } from "react";

export const RemoteContext = createContext({
    commands: {} as remoteConstantsDTO,
    setCommands: (commands: remoteConstantsDTO) => {}
});

export const RemoteProvider = ({ children }: any) => {
    const [commands, setCommands] = useState({} as remoteConstantsDTO);
    
    return (
        <RemoteContext.Provider value={{ commands, setCommands }}>
            {children}
        </RemoteContext.Provider>
    )
}