import { RemoteDirection, RemoteKeyCode } from "androidtv-remote";

export const remoteConstants = {
    power: RemoteKeyCode.KEYCODE_POWER,
    DPad: {
        left: RemoteKeyCode.KEYCODE_DPAD_LEFT,
        right: RemoteKeyCode.KEYCODE_DPAD_RIGHT,
        up: RemoteKeyCode.KEYCODE_DPAD_UP,
        down: RemoteKeyCode.KEYCODE_DPAD_DOWN,
        validate: RemoteKeyCode.KEYCODE_DPAD_CENTER
    },
    volume: {
        up: RemoteKeyCode.KEYCODE_VOLUME_UP,
        down: RemoteKeyCode.KEYCODE_VOLUME_DOWN
    },
    zoom: {
        in: "zoomIn",
        out: "zoomOut"
    },
    back: RemoteKeyCode.KEYCODE_BACK,
    home: RemoteKeyCode.KEYCODE_HOME,
    exit: "exit",
    favorite: "favorite",
    videoControls: {
        rewind: RemoteKeyCode.KEYCODE_MEDIA_REWIND,
        playPause: RemoteKeyCode.KEYCODE_MEDIA_PLAY_PAUSE,
        forward: RemoteKeyCode.KEYCODE_MEDIA_FAST_FORWARD
    },
    directions: {
        shortPress: RemoteDirection.SHORT,
        longPressStart: RemoteDirection.START_LONG,
        longPressEnd: RemoteDirection.END_LONG
    }
}