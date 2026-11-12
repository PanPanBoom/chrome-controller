import { createContext, useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Modal } from 'react-native';
import { router } from "expo-router"

export const ModalContext = createContext({
    showModal: (component: any) => {},
    hideModal: () => {},
    content: null
});

export const ModalProvider = ({ children }: any) => {
    const [content, setContent] = useState(null);

    const showModal = (component: any) => {
        setContent(component)
        router.push({ pathname: '/modal'});
    };
    const hideModal = () => {
        setContent(null);
        router.back();
    }

    return (
        <ModalContext.Provider value={{ showModal, hideModal, content }}>
            {children}
        </ModalContext.Provider>
    )
}