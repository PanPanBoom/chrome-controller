import { ServerDataDTO } from "@/dtos/serverData";
import { createContext, useState } from "react";

export const AppContext = createContext({
    server: {} as ServerDataDTO,
    setServer: (server: ServerDataDTO) => {}
});

export const AppProvider = ({ children }) => {
    const [server, setServer] = useState({} as ServerDataDTO);

    return (
        <AppContext.Provider value={{ server, setServer }}>
            {children}
        </AppContext.Provider>
    );
}