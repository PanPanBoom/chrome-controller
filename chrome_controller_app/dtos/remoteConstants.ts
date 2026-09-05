export type remoteConstantsDTO = {
    power: number,
    DPad: {
        left: number,
        right: number,
        up: number,
        down: number,
        validate: number
    },
    volume: {
        up: number,
        down: number,
        mute: number
    },
    zoom: {
        in: string,
        out: string
    },
    back: number,
    home: number,
    exit: string,
    favorite: string,
    videoControls: {
        rewind: number,
        playPause: number,
        forward: number
    },
    directions: {
        shortPress: number,
        longPressStart: number,
        longPressEnd: number
    }
}