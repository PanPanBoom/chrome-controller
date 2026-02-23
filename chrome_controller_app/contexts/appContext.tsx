import { createContext, useState } from "react";

export const AppContext = createContext({
    serverIp: "",
    setServerIp: (ip: string) => {}
});

export const AppProvider = ({ children }) => {
    const [serverIp, setServerIp] = useState("");

    return (
        <AppContext.Provider value={{ serverIp, setServerIp }}>
            {children}
        </AppContext.Provider>
    );
}