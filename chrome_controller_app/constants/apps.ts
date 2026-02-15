import { Linking } from "react-native"
import { App } from "../dtos/app"

export const apps: Record<string, App> = {
    "youtube": {
        img: require("../assets/images/youtube.png"),
        url: "https://www.youtube.com/tv",
        redirect: () => Linking.openURL("https://www.youtube.com")
    },
    "netflix": {
        img: require("../assets/images/netflix.png"),
        url: "https://www.netflix.com/"
    },
    "prime": {
        img: require("../assets/images/prime.png"),
        url: "https://www.primevideo.com/"
    },
}