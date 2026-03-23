import { Star } from "lucide-react-native"
import { IconButton } from "./ui/IconButton"
import { useContext, useEffect, useState } from "react"
import { sendFavorite, socket } from "@/server/socket";
import { AppContext } from "@/contexts/appContext";

export const FavoriteButton = () => {
    const { server } = useContext(AppContext);
    const [isInFavorite, setIsInFavorite] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        socket.on('activeFavorite', () => {
            setIsInFavorite(true)
            setIsDisabled(false)
        });
        socket.on('inactiveFavorite', () => {
            setIsInFavorite(false)
            setIsDisabled(false)
        });
        socket.on('disabledFavorite', () => {
            setIsInFavorite(false);
            setIsDisabled(true)
        });
    })

    const handlePress = () => {
        sendFavorite(server.ip, !isInFavorite).then(() => setIsInFavorite(prev => !prev));
    }

    return (
        <IconButton 
            icon={Star}
            fill={isInFavorite ? "#f0b604" : undefined}
            onPress={handlePress}
            disabled={isDisabled}
        />
    )
}